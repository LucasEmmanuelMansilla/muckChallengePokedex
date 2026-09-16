import type { PokemonType } from '../domain/pokemonCatalog';
import { isPokemonType } from '../domain/pokemonCatalog';

export const colors = {
  background: '#F6F1E8',
  surface: '#FFFFFF',
  primary: '#DE2C2C',
  primaryDark: '#9B1B1B',
  ink: '#1C1917',
  muted: '#6F6964',
  line: '#E7E0D5',
  chipText: '#FFFFFF',
  errorSoft: '#FFF1F0',
  errorRing: '#F0C7C2',
};

// Oscurecidos para ≥ 4.5:1 con texto blanco (WCAG AA).
export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#7A7750',
  fire: '#B36124',
  water: '#4277C0',
  electric: '#8F7200',
  grass: '#48832E',
  ice: '#3C817E',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#8E7020',
  flying: '#7860C9',
  psychic: '#CC426F',
  bug: '#707D0F',
  rock: '#857627',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#6F6F95',
  fairy: '#B15A81',
};

export const TYPE_LABELS: Record<PokemonType, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

const FALLBACK_TYPE_COLOR = TYPE_COLORS.normal;

export function typeColor(type: string): string {
  return isPokemonType(type) ? TYPE_COLORS[type] : FALLBACK_TYPE_COLOR;
}

export function typeLabel(type: string): string {
  return isPokemonType(type) ? TYPE_LABELS[type] : type;
}
