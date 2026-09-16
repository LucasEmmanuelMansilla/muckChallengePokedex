import {
  eggGroupLabel,
  formatGender,
  formatMetric,
  formatPokedexNumber,
  formatPokemonName,
  generationLabel,
  growthRateLabel,
  habitatLabel,
  statLabel,
} from '../src/presentation/formatPokemon';

describe('formatPokemon', () => {
  it('formatea nombres compuestos, número de Pokédex y métricas', () => {
    expect(formatPokemonName('mr-mime')).toBe('Mr Mime');
    expect(formatPokedexNumber(25)).toBe('N.º 0025');
    expect(formatMetric(0.7, 'm')).toMatch(/0[,.]7 m/);
  });

  it('traduce el ratio de género de PokéAPI', () => {
    expect(formatGender(-1)).toBe('Sin género');
    expect(formatGender(0)).toBe('100% macho');
    expect(formatGender(8)).toBe('100% hembra');
    expect(formatGender(1)).toMatch(
      /87[,.]5% macho · 12[,.]5% hembra/,
    );
  });

  it('si la API manda un valor nuevo, lo muestra de forma legible', () => {
    expect(habitatLabel('space')).toBe('Space');
    expect(eggGroupLabel('new-group')).toBe('New Group');
    expect(generationLabel('generation-x')).toBe('Generation X');
    expect(growthRateLabel('erratic')).toBe('Erratic');
    expect(statLabel('accuracy')).toBe('Accuracy');
  });
});
