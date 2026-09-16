import React from 'react';
import { Text } from 'react-native';
import { AppErrorBoundary } from '../src/presentation/AppErrorBoundary';
import { pressText, render, textOf } from './helpers/render';

function Bomb({ explode }: { explode: boolean }) {
  if (explode) {
    throw new Error('boom');
  }
  return <Text>Pokédex intacta</Text>;
}

describe('AppErrorBoundary', () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  afterAll(() => {
    consoleError.mockRestore();
  });

  it('muestra un mensaje amigable y permite reintentar', async () => {
    const tree = await render(
      <AppErrorBoundary>
        <Bomb explode />
      </AppErrorBoundary>,
    );

    expect(textOf(tree.root)).toContain('se trabó al mostrar la pantalla');

    await pressText(tree, 'Reintentar');
  });
});
