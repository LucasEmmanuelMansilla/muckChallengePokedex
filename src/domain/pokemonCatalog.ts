export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const STAT_NAMES = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

export type StatName = (typeof STAT_NAMES)[number];

export const HABITAT_NAMES = [
  'cave',
  'forest',
  'grassland',
  'mountain',
  'rare',
  'rough-terrain',
  'sea',
  'urban',
  'waters-edge',
] as const;

export type HabitatName = (typeof HABITAT_NAMES)[number];

export const EGG_GROUP_NAMES = [
  'monster',
  'water1',
  'water2',
  'water3',
  'bug',
  'flying',
  'ground',
  'fairy',
  'plant',
  'humanshape',
  'mineral',
  'indeterminate',
  'ditto',
  'dragon',
  'no-eggs',
] as const;

export type EggGroupName = (typeof EGG_GROUP_NAMES)[number];

export const GROWTH_RATE_NAMES = [
  'slow',
  'medium',
  'fast',
  'medium-slow',
  'slow-then-very-fast',
  'fast-then-very-slow',
] as const;

export type GrowthRateName = (typeof GROWTH_RATE_NAMES)[number];

export const GENERATION_NAMES = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
  'generation-viii',
  'generation-ix',
] as const;

export type GenerationName = (typeof GENERATION_NAMES)[number];

function isCatalogValue<T extends string>(
  catalog: readonly T[],
  value: string,
): value is T {
  return (catalog as readonly string[]).includes(value);
}

export function isPokemonType(value: string): value is PokemonType {
  return isCatalogValue(POKEMON_TYPES, value);
}

export function isStatName(value: string): value is StatName {
  return isCatalogValue(STAT_NAMES, value);
}

export function isHabitatName(value: string): value is HabitatName {
  return isCatalogValue(HABITAT_NAMES, value);
}

export function isEggGroupName(value: string): value is EggGroupName {
  return isCatalogValue(EGG_GROUP_NAMES, value);
}

export function isGrowthRateName(value: string): value is GrowthRateName {
  return isCatalogValue(GROWTH_RATE_NAMES, value);
}

export function isGenerationName(value: string): value is GenerationName {
  return isCatalogValue(GENERATION_NAMES, value);
}
