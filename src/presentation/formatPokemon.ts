export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatPokedexNumber(id: number): string {
  return `N.º ${String(id).padStart(4, '0')}`;
}

export function formatMetric(value: number, unit: string): string {
  return `${value.toLocaleString('es-AR', {
    maximumFractionDigits: 1,
  })} ${unit}`;
}

const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

export function statLabel(stat: string): string {
  return STAT_LABELS[stat] ?? formatPokemonName(stat);
}

const HABITAT_LABELS: Record<string, string> = {
  cave: 'Cueva',
  forest: 'Bosque',
  grassland: 'Pradera',
  mountain: 'Montaña',
  rare: 'Raro',
  'rough-terrain': 'Terreno difícil',
  sea: 'Mar',
  urban: 'Urbano',
  'waters-edge': 'Orilla',
};

export function habitatLabel(habitat: string): string {
  return HABITAT_LABELS[habitat] ?? formatPokemonName(habitat);
}

const EGG_GROUP_LABELS: Record<string, string> = {
  monster: 'Monstruo',
  water1: 'Agua 1',
  water2: 'Agua 2',
  water3: 'Agua 3',
  bug: 'Bicho',
  flying: 'Volador',
  ground: 'Campo',
  fairy: 'Hada',
  plant: 'Planta',
  humanshape: 'Humanoide',
  mineral: 'Mineral',
  indeterminate: 'Amorfo',
  ditto: 'Ditto',
  dragon: 'Dragón',
  'no-eggs': 'Desconocido',
};

export function eggGroupLabel(group: string): string {
  return EGG_GROUP_LABELS[group] ?? formatPokemonName(group);
}

const GENERATION_LABELS: Record<string, string> = {
  'generation-i': 'I',
  'generation-ii': 'II',
  'generation-iii': 'III',
  'generation-iv': 'IV',
  'generation-v': 'V',
  'generation-vi': 'VI',
  'generation-vii': 'VII',
  'generation-viii': 'VIII',
  'generation-ix': 'IX',
};

export function generationLabel(generation: string): string {
  const roman = GENERATION_LABELS[generation];
  return roman ? `Generación ${roman}` : formatPokemonName(generation);
}

const GROWTH_RATE_LABELS: Record<string, string> = {
  slow: 'Lento',
  medium: 'Medio',
  fast: 'Rápido',
  'medium-slow': 'Medio-lento',
  'slow-then-very-fast': 'Lento a muy rápido',
  'fast-then-very-slow': 'Rápido a muy lento',
};

export function growthRateLabel(growthRate: string): string {
  return GROWTH_RATE_LABELS[growthRate] ?? formatPokemonName(growthRate);
}

export function formatGender(genderRate: number): string {
  if (genderRate < 0) {
    return 'Sin género';
  }

  const female = (genderRate / 8) * 100;
  const male = 100 - female;

  if (male === 100) {
    return '100% macho';
  }

  if (female === 100) {
    return '100% hembra';
  }

  return `${formatPercent(male)}% macho · ${formatPercent(female)}% hembra`;
}

function formatPercent(value: number): string {
  return value.toLocaleString('es-AR', { maximumFractionDigits: 1 });
}
