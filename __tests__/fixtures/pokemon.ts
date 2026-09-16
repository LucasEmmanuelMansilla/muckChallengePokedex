import type { Pokemon, PokemonDetail } from '../../src/domain/Pokemon';

export const bulbasaur: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  imageUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png',
  types: ['grass', 'poison'],
  heightMeters: 0.7,
  weightKilograms: 6.9,
};

export const ivysaur: Pokemon = {
  ...bulbasaur,
  id: 2,
  name: 'ivysaur',
  imageUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/2.png',
  heightMeters: 1,
  weightKilograms: 13,
};

export const bulbasaurDetail: PokemonDetail = {
  ...bulbasaur,
  description: 'Una semilla extraña le fue plantada en el lomo al nacer.',
  genus: 'Pokémon Semilla',
  abilities: [
    { name: 'Espesura', isHidden: false },
    { name: 'Clorofila', isHidden: true },
  ],
  stats: [
    { name: 'hp', value: 45 },
    { name: 'attack', value: 49 },
    { name: 'defense', value: 49 },
    { name: 'special-attack', value: 65 },
    { name: 'special-defense', value: 65 },
    { name: 'speed', value: 45 },
  ],
  baseExperience: 64,
  habitat: 'grassland',
  captureRate: 45,
  eggGroups: ['monster', 'plant'],
  genderRate: 1,
  isLegendary: false,
  isMythical: false,
  generation: 'generation-i',
  growthRate: 'medium-slow',
};

export const mewtwoDetail: PokemonDetail = {
  id: 150,
  name: 'mewtwo',
  imageUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/150.png',
  types: ['psychic'],
  heightMeters: 2,
  weightKilograms: 122,
  description: '',
  genus: '',
  abilities: [],
  stats: [],
  baseExperience: null,
  habitat: null,
  captureRate: 3,
  eggGroups: [],
  genderRate: -1,
  isLegendary: true,
  isMythical: false,
  generation: 'generation-i',
  growthRate: 'slow',
};

export const mewDetail: PokemonDetail = {
  ...mewtwoDetail,
  id: 151,
  name: 'mew',
  imageUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/151.png',
  isLegendary: false,
  isMythical: true,
  captureRate: 45,
};

export function listPage(items: Pokemon[], hasMore = false) {
  return { items, hasMore };
}
