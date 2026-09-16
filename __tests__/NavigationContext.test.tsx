import React from 'react';
import { BackHandler, Pressable, Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { AppError } from '../src/domain/AppError';
import {
  NavigationProvider,
  useNavigation,
} from '../src/navigation/NavigationContext';
import { useReloadSignal } from '../src/navigation/ReloadContext';
import { pressA11y, render, textOf } from './helpers/render';

function Probe() {
  const { stack, navigate, goBack, navigateToError, retry } = useNavigation();
  const { reloadCount } = useReloadSignal();
  const top = stack[stack.length - 1];

  return (
    <>
      <Text>{`ruta:${top?.name ?? 'ninguna'}`}</Text>
      <Text>{`retry:${reloadCount}`}</Text>
      <Text>{`stack:${stack.length}`}</Text>
      <Pressable
        accessibilityLabel="abrir-ficha"
        onPress={() => navigate({ name: 'PokemonDetail', pokemonId: 1 })}
      />
      <Pressable
        accessibilityLabel="abrir-error"
        onPress={() =>
          navigateToError({ source: 'list', error: new AppError('network') })
        }
      />
      <Pressable accessibilityLabel="atras" onPress={goBack} />
      <Pressable accessibilityLabel="reintentar" onPress={retry} />
    </>
  );
}

describe('navegación', () => {
  it('apila ficha y error, sin duplicar la pantalla de error', async () => {
    const tree = await render(
      <NavigationProvider>
        <Probe />
      </NavigationProvider>,
    );

    expect(textOf(tree.root)).toContain('ruta:Home');

    await pressA11y(tree, 'abrir-ficha');
    expect(textOf(tree.root)).toContain('ruta:PokemonDetail');

    await pressA11y(tree, 'abrir-error');
    await pressA11y(tree, 'abrir-error');
    expect(textOf(tree.root)).toContain('ruta:Error');
    expect(textOf(tree.root)).toContain('stack:3');
  });

  it('reintentar cierra el error y pide de nuevo los datos', async () => {
    const tree = await render(
      <NavigationProvider>
        <Probe />
      </NavigationProvider>,
    );

    await pressA11y(tree, 'abrir-error');
    await pressA11y(tree, 'reintentar');

    expect(textOf(tree.root)).toContain('ruta:Home');
    expect(textOf(tree.root)).toContain('retry:1');
    expect(textOf(tree.root)).toContain('stack:1');
  });

  it('atrás no sale de Home y el hardware back reintenta el error', async () => {
    const listeners: Array<() => boolean> = [];
    const spy = jest
      .spyOn(BackHandler, 'addEventListener')
      .mockImplementation((_event, handler) => {
        listeners.push(handler as () => boolean);
        return { remove: jest.fn() };
      });

    const tree = await render(
      <NavigationProvider>
        <Probe />
      </NavigationProvider>,
    );

    expect(listeners[0]?.()).toBe(false);

    await pressA11y(tree, 'abrir-ficha');
    await ReactTestRenderer.act(async () => {
      expect(listeners[0]?.()).toBe(true);
    });
    expect(textOf(tree.root)).toContain('ruta:Home');

    await pressA11y(tree, 'abrir-error');
    await ReactTestRenderer.act(async () => {
      expect(listeners[0]?.()).toBe(true);
    });
    expect(textOf(tree.root)).toContain('ruta:Home');
    expect(textOf(tree.root)).toContain('retry:1');

    await pressA11y(tree, 'atras');
    expect(textOf(tree.root)).toContain('ruta:Home');

    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
    spy.mockRestore();
  });
});
