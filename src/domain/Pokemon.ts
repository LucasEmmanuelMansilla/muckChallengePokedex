export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  heightMeters: number;
  weightKilograms: number;
};

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonDetail = Pokemon & {
  description: string;
  genus: string;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  baseExperience: number | null;
  habitat: string | null;
  captureRate: number;
  eggGroups: string[];
  // PokéAPI: -1 sin género; 0–8 octavos de probabilidad hembra.
  genderRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  generation: string;
  growthRate: string;
};

export type PokemonListParams = {
  limit: number;
  offset: number;
};

export interface PokemonRepository {
  list(params: PokemonListParams): Promise<Pokemon[]>;
  getById(id: number): Promise<PokemonDetail>;
}
