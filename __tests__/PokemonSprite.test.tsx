import React from 'react';
import { Image } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { PokemonSprite } from '../src/presentation/PokemonSprite';
import { render, styleOf } from './helpers/render';

describe('PokemonSprite', () => {
  it('cae a la Pokébola si la imagen remota falla', async () => {
    const tree = await render(
      <PokemonSprite uri="https://example.com/missing.png" size={88} />,
    );

    await TestRenderer.act(async () => {
      tree.root.findByType(Image).props.onError();
    });

    expect(styleOf(tree.root.findByType(Image)).width).toBe(63);
  });
});
