import type {
  EggGroupName,
  HabitatName,
  PokemonType,
  StatName,
} from './pokemonCatalog';

export type {
  EggGroupName,
  GenerationName,
  GrowthRateName,
  HabitatName,
  PokemonType,
  StatName,
} from './pokemonCatalog';

/**
 * El listado no pide species ni abilities: `Pokemon` es lo que cabe en una
 * card. `PokemonDetail` suma ficha. Separarlos evita hidratar 20 fichas
 * completas para pintar el scroll.
 */
export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  heightMeters: number;
  weightKilograms: number;
};

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type PokemonStat = {
  name: StatName;
  value: number;
};

export type PokemonDetail = Pokemon & {
  description: string;
  genus: string;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  baseExperience: number | null;
  habitat: HabitatName | null;
  captureRate: number;
  eggGroups: EggGroupName[];
  // PokéAPI: -1 sin género; 0–8 octavos de probabilidad hembra.
  genderRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  // Se dejan como string: PokéAPI puede sumar generaciones/tasas. La UI
  // traduce las conocidas y formatea el resto en vez de ocultar el dato.
  generation: string;
  growthRate: string;
};

export type PokemonListParams = {
  limit: number;
  offset: number;
};

/**
 * El caso de uso depende de este puerto, no de PokéAPI. Así se puede
 * cachear, fakear en tests o cambiar de API sin tocar application.
 */
export interface PokemonRepository {
  list(params: PokemonListParams): Promise<Pokemon[]>;
  getById(id: number): Promise<PokemonDetail>;
}
