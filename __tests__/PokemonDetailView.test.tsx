import React from 'react';
import { PokemonDetailView } from '../src/presentation/pokemonDetail/PokemonDetailView';
import {
  bulbasaurDetail,
  mewDetail,
  mewtwoDetail,
} from './fixtures/pokemon';
import { pressA11y, render, textOf } from './helpers/render';

describe('PokemonDetailView', () => {
  it('muestra datos, habilidades, stats y grupos huevo de una ficha completa', async () => {
    const tree = await render(
      <PokemonDetailView pokemon={bulbasaurDetail} onBack={() => {}} />,
    );
    const text = textOf(tree.root);

    expect(text).toContain('Bulbasaur');
    expect(text).toContain('N.º 0001');
    expect(text).toContain('Pokémon Semilla');
    expect(text).toContain('Planta');
    expect(text).toContain('Veneno');
    expect(text).toContain('Pradera');
    expect(text).toContain('PS');
    expect(text).toContain('At. Esp.');
    expect(text).toContain('Monstruo');
    expect(text).toContain('Exp. base');
    expect(text).toContain('64');
    expect(text).toMatch(/87[,.]5% macho/);
  });

  it('marca un Pokémon legendario y no inventa datos que la API no trajo', async () => {
    const tree = await render(
      <PokemonDetailView pokemon={mewtwoDetail} onBack={() => {}} />,
    );
    const text = textOf(tree.root);

    expect(text).toContain('Pokémon legendario');
    expect(text).toContain('Sin género');
    expect(text).toContain('Desconocido');
    expect(text).toContain('Lento');
    expect(text).not.toContain('Habilidades');
    expect(text).not.toContain('Estadísticas base');
    expect(text).not.toContain('Grupos huevo');
    expect(text).not.toContain('Exp. base');
    expect(text).not.toContain('Pokémon singular');
  });

  it('marca un Pokémon singular distinto de un legendario', async () => {
    const tree = await render(
      <PokemonDetailView pokemon={mewDetail} onBack={() => {}} />,
    );

    expect(textOf(tree.root)).toContain('Pokémon singular');
    expect(textOf(tree.root)).not.toContain('Pokémon legendario');
  });

  it('un stat fuera del rango típico no rompe la ficha', async () => {
    const tree = await render(
      <PokemonDetailView
        pokemon={{
          ...bulbasaurDetail,
          stats: [{ name: 'hp', value: 300 }],
        }}
        onBack={() => {}}
      />,
    );

    expect(textOf(tree.root)).toContain('300');
  });

  it('sin tipos conocidos sigue mostrando la ficha', async () => {
    const tree = await render(
      <PokemonDetailView
        pokemon={{ ...bulbasaurDetail, types: [] }}
        onBack={() => {}}
      />,
    );

    expect(textOf(tree.root)).toContain('Bulbasaur');
  });

  it('el botón atrás de la ficha es usable', async () => {
    const onBack = jest.fn();
    const tree = await render(
      <PokemonDetailView pokemon={bulbasaurDetail} onBack={onBack} />,
    );

    await pressA11y(tree, 'Volver al listado');
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
