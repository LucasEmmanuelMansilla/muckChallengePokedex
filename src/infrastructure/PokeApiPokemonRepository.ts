import type { HttpClient } from '../domain/HttpClient';
import type {
  Pokemon,
  PokemonAbility,
  PokemonDetail,
  PokemonListParams,
  PokemonRepository,
} from '../domain/Pokemon';

type NamedApiResource = {
  name: string;
};

type LocalizedName = {
  name: string;
  language: { name: string };
};

type PokemonListApiResponse = {
  results: Array<{
    name: string;
    url: string;
  }>;
};

type PokemonApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: Array<{
    slot: number;
    type: { name: string };
  }>;
  abilities: Array<{
    slot: number;
    is_hidden: boolean;
    ability: NamedApiResource;
  }>;
  stats: Array<{
    base_stat: number;
    stat: NamedApiResource;
  }>;
};

type PokemonSpeciesApiResponse = {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  genera: Array<{
    genus: string;
    language: { name: string };
  }>;
  capture_rate: number;
  habitat: NamedApiResource | null;
  gender_rate: number;
  egg_groups: NamedApiResource[];
  is_legendary: boolean;
  is_mythical: boolean;
  generation: NamedApiResource;
  growth_rate: NamedApiResource;
};

type AbilityApiResponse = {
  names: LocalizedName[];
};

export class PokeApiPokemonRepository implements PokemonRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async list({ limit, offset }: PokemonListParams): Promise<Pokemon[]> {
    const response = await this.httpClient.get<PokemonListApiResponse>(
      '/pokemon',
      { limit, offset },
    );

    // El listado no trae tipos ni medidas; se piden en paralelo para armar la card.
    return Promise.all(response.results.map(item => this.toPokemon(item)));
  }

  async getById(id: number): Promise<PokemonDetail> {
    const [pokemon, species] = await Promise.all([
      this.httpClient.get<PokemonApiResponse>(`/pokemon/${id}`),
      this.httpClient.get<PokemonSpeciesApiResponse>(
        `/pokemon-species/${id}`,
      ),
    ]);

    const abilities = await this.toAbilities(pokemon.abilities);

    return {
      ...this.mapPokemon(id, pokemon.name, pokemon),
      description: pickFlavorText(species.flavor_text_entries),
      genus: pickLocalized(species.genera, entry => entry.genus),
      abilities,
      stats: pokemon.stats.map(entry => ({
        name: entry.stat.name,
        value: entry.base_stat,
      })),
      baseExperience: pokemon.base_experience,
      habitat: species.habitat?.name ?? null,
      captureRate: species.capture_rate,
      eggGroups: species.egg_groups.map(group => group.name),
      genderRate: species.gender_rate,
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      generation: species.generation.name,
      growthRate: species.growth_rate.name,
    };
  }

  private async toPokemon(item: {
    name: string;
    url: string;
  }): Promise<Pokemon> {
    const id = idFromResourceUrl(item.url);
    const detail = await this.httpClient.get<PokemonApiResponse>(
      `/pokemon/${id}`,
    );

    return this.mapPokemon(id, item.name, detail);
  }

  private mapPokemon(
    id: number,
    name: string,
    detail: PokemonApiResponse,
  ): Pokemon {
    return {
      id,
      name,
      imageUrl: homeSpriteUrl(id),
      types: detail.types
        .sort((a, b) => a.slot - b.slot)
        .map(entry => entry.type.name),
      heightMeters: detail.height / 10,
      weightKilograms: detail.weight / 10,
    };
  }

  private async toAbilities(
    abilities: PokemonApiResponse['abilities'],
  ): Promise<PokemonAbility[]> {
    const ordered = [...abilities].sort((a, b) => a.slot - b.slot);

    return Promise.all(
      ordered.map(async entry => {
        const ability = await this.httpClient.get<AbilityApiResponse>(
          `/ability/${entry.ability.name}`,
        );

        return {
          name:
            pickLocalized(ability.names, item => item.name) ||
            entry.ability.name,
          isHidden: entry.is_hidden,
        };
      }),
    );
  }
}

function idFromResourceUrl(url: string): number {
  const segment = url.split('/').filter(Boolean).pop();
  return Number(segment);
}

// Las URLs de sprites de PokéAPI son deterministas por id; evita depender del payload de detalle.
function homeSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

function pickLocalized<T extends { language: { name: string } }>(
  entries: T[],
  read: (entry: T) => string,
): string {
  const byLang = (language: string) =>
    entries.find(entry => entry.language.name === language);

  const match = byLang('es') ?? byLang('en');
  return match ? read(match) : '';
}

function pickFlavorText(
  entries: Array<{ flavor_text: string; language: { name: string } }>,
): string {
  const byLang = (language: string) =>
    [...entries]
      .reverse()
      .find(entry => entry.language.name === language)?.flavor_text;

  const raw = byLang('es') ?? byLang('en') ?? '';
  return raw.replace(/[\f\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
}
