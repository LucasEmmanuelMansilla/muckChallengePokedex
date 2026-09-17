import type { HttpClient } from '../domain/HttpClient';
import {
  isEggGroupName,
  isHabitatName,
  isPokemonType,
  isStatName,
} from '../domain/pokemonCatalog';
import type {
  HabitatName,
  Pokemon,
  PokemonAbility,
  PokemonDetail,
  PokemonListParams,
  PokemonRepository,
  PokemonStat,
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

/**
 * Único archivo que habla el dialecto de PokéAPI (snake_case, dm/hg,
 * species vs pokemon). El resto de la app trabaja en el modelo de dominio.
 */
export class PokeApiPokemonRepository implements PokemonRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async list({ limit, offset }: PokemonListParams): Promise<Pokemon[]> {
    const response = await this.httpClient.get<PokemonListApiResponse>(
      '/pokemon',
      { limit, offset },
    );

    // El listado no trae tipos ni medidas; se piden en paralelo acotado para no abrir 20 sockets a la vez.
    return mapPool(response.results, 6, item => this.toPokemon(item));
  }

  async getById(id: number): Promise<PokemonDetail> {
    // pokemon y species son recursos distintos; en paralelo porque la ficha
    // necesita ambos y no hay dependencia entre ellos.
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
      stats: pokemon.stats.flatMap(entry => {
        const stat = toPokemonStat(entry.stat.name, entry.base_stat);
        return stat ? [stat] : [];
      }),
      baseExperience: pokemon.base_experience,
      habitat: toHabitatName(species.habitat?.name),
      captureRate: species.capture_rate,
      eggGroups: species.egg_groups
        .map(group => group.name)
        .filter(isEggGroupName),
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
        .map(entry => entry.type.name)
        // Un tipo nuevo de PokéAPI no debe romper chips ni TYPE_COLORS.
        .filter(isPokemonType),
      // PokéAPI usa decímetros y hectogramos; el dominio habla en SI.
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
        // El nombre jugable está en /ability; el resource del Pokémon
        // solo trae el slug en inglés.
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

function toPokemonStat(name: string, value: number): PokemonStat | null {
  if (!isStatName(name)) {
    return null;
  }

  return { name, value };
}

function toHabitatName(name: string | undefined): HabitatName | null {
  if (!name || !isHabitatName(name)) {
    return null;
  }

  return name;
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

  // Español primero; inglés como fallback estable de PokéAPI.
  const match = byLang('es') ?? byLang('en');
  return match ? read(match) : '';
}

function pickFlavorText(
  entries: Array<{ flavor_text: string; language: { name: string } }>,
): string {
  const byLang = (language: string) =>
    [...entries]
      // Las entradas más nuevas suelen ser juegos recientes (texto más limpio).
      .reverse()
      .find(entry => entry.language.name === language)?.flavor_text;

  const raw = byLang('es') ?? byLang('en') ?? '';
  // Los flavor text de los juegos traen \f y saltos; la ficha es un párrafo.
  return raw.replace(/[\f\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) {
    return [];
  }

  const results = new Array<R>(items.length);
  // Cursor compartido: N workers, orden de `items` intacto (no Promise.all
  // de 20 ni un for serial).
  let cursor = 0;

  async function worker() {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) {
        return;
      }
      results[index] = await mapper(items[index]);
    }
  }

  const workerCount = Math.min(Math.max(limit, 1), items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
