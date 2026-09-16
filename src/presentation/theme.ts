export const colors = {
  background: '#F6F1E8',
  surface: '#FFFFFF',
  primary: '#DE2C2C',
  primaryDark: '#9B1B1B',
  ink: '#1C1917',
  muted: '#78716C',
  line: '#E7E0D5',
  chipText: '#FFFFFF',
  errorSoft: '#FFF1F0',
  headerMuted: '#FAD4D4',
  errorRing: '#F0C7C2',
};

export const TYPE_COLORS: Record<string, string> = {
  normal: '#8F8C5E',
  fire: '#EE8130',
  water: '#4A86D8',
  electric: '#C9A000',
  grass: '#5EAA3C',
  ice: '#4EA8A4',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#B9922A',
  flying: '#7E65D4',
  psychic: '#E0487A',
  bug: '#8A9A12',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#6F6F95',
  fairy: '#D06A98',
};

export const TYPE_LABELS: Record<string, string> = {
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

const FALLBACK_TYPE_COLOR = '#8F8C5E';

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? FALLBACK_TYPE_COLOR;
}

export function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}
