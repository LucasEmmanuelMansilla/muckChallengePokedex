import {
  listColumnCount,
  typeColor,
  typeLabel,
} from '../src/presentation/theme';

describe('tipos de Pokémon', () => {
  it('un tipo desconocido sigue siendo usable en la UI', () => {
    expect(typeColor('stellar')).toBe(typeColor('normal'));
    expect(typeLabel('stellar')).toBe('stellar');
  });
});

describe('columnas del listado', () => {
  it('usa una columna en teléfono y dos desde tablet', () => {
    expect(listColumnCount(375)).toBe(1);
    expect(listColumnCount(599)).toBe(1);
    expect(listColumnCount(600)).toBe(2);
  });
});
