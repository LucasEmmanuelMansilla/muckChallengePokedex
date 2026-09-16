export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  heightMeters: number;
  weightKilograms: number;
};

export type PokemonListParams = {
  limit: number;
  offset: number;
};

export interface PokemonRepository {
  list(params: PokemonListParams): Promise<Pokemon[]>;
}
