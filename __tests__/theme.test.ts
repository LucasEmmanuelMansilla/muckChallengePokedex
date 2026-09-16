import { typeColor, typeLabel } from '../src/presentation/theme';

describe('tipos de Pokémon', () => {
  it('un tipo desconocido sigue siendo usable en la UI', () => {
    expect(typeColor('stellar')).toBe(typeColor('normal'));
    expect(typeLabel('stellar')).toBe('stellar');
  });
});
