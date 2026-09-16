import type { HttpClient } from '../domain/HttpClient';
import type {
  Pokemon,
  PokemonListParams,
  PokemonRepository,
} from '../domain/Pokemon';

type PokemonListApiResponse = {
  results: Array<{
    name: string;
    url: string;
  }>;
};

type PokemonDetailApiResponse = {
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: { name: string };
  }>;
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

  private async toPokemon(item: {
    name: string;
    url: string;
  }): Promise<Pokemon> {
    const id = idFromResourceUrl(item.url);
    const detail = await this.httpClient.get<PokemonDetailApiResponse>(
      `/pokemon/${id}`,
    );

    return {
      id,
      name: item.name,
      imageUrl: homeSpriteUrl(id),
      types: detail.types
        .sort((a, b) => a.slot - b.slot)
        .map(entry => entry.type.name),
      heightMeters: detail.height / 10,
      weightKilograms: detail.weight / 10,
    };
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
