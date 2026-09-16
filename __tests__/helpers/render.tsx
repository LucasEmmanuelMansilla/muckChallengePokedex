import React, { type ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import TestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer,
} from 'react-test-renderer';
import { getPokemon, listPokemon } from '../../src/di/container';
import { PokemonUseCasesProvider } from '../../src/di/PokemonUseCasesContext';
import { NavigationProvider } from '../../src/navigation/NavigationContext';

export function TestProviders({ children }: { children: ReactNode }) {
  return (
    <PokemonUseCasesProvider listPokemon={listPokemon} getPokemon={getPokemon}>
      <NavigationProvider>{children}</NavigationProvider>
    </PokemonUseCasesProvider>
  );
}

export async function render(element: React.ReactElement) {
  let tree: ReactTestRenderer;

  await TestRenderer.act(async () => {
    tree = TestRenderer.create(element);
  });

  await flush();
  return tree!;
}

export async function flush() {
  await TestRenderer.act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

export function textOf(node: ReactTestInstance | ReactTestRenderer) {
  const root = 'root' in node ? node.root : node;
  return root
    .findAllByType(Text)
    .map(item => flatten(item.props.children))
    .filter(Boolean)
    .join(' ');
}

export function activeScreen(tree: ReactTestRenderer) {
  const screens = tree.root.findAll(
    node => node.props.pointerEvents === 'auto',
  );
  return screens[screens.length - 1] ?? tree.root;
}

export async function press(node: ReactTestInstance) {
  const handler =
    node.props.onPress ??
    node.findAll(item => typeof item.props.onPress === 'function')[0]?.props
      .onPress;

  if (typeof handler !== 'function') {
    throw new Error('No hay onPress en el nodo');
  }

  await TestRenderer.act(async () => {
    handler();
    await Promise.resolve();
    await Promise.resolve();
  });
}

export async function pressA11y(
  node: ReactTestInstance | ReactTestRenderer,
  label: string,
) {
  const root = 'root' in node ? node.root : node;
  await press(root.findByProps({ accessibilityLabel: label }));
}

export async function pressText(
  node: ReactTestInstance | ReactTestRenderer,
  label: string,
) {
  const root = 'root' in node ? node.root : node;
  const match = root
    .findAll(item => typeof item.props.onPress === 'function')
    .find(item => textOf(item).includes(label));

  if (!match) {
    throw new Error(`No se encontró el botón "${label}"`);
  }

  await press(match);
}

function flatten(children: unknown): string {
  if (children == null || typeof children === 'boolean') {
    return '';
  }

  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(flatten).join('');
  }

  return '';
}

export function styleOf(node: ReactTestInstance) {
  return StyleSheet.flatten(node.props.style);
}
