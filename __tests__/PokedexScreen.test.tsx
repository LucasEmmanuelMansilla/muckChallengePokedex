import React from 'react';
import { NativeModules, Platform, StatusBar, Text, View } from 'react-native';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { styleOf } from './helpers/render';

async function renderScreen() {
  let tree: ReactTestRenderer;

  await TestRenderer.act(async () => {
    tree = TestRenderer.create(
      <PokedexScreen header={<Text>Header</Text>}>
        <Text>Cuerpo</Text>
      </PokedexScreen>,
    );
  });

  return tree!;
}

function setPlatform(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

describe('PokedexScreen', () => {
  const originalOS = Platform.OS;
  const originalHeight = StatusBar.currentHeight;
  const originalStatusBarManager = NativeModules.StatusBarManager;
  const trees: ReactTestRenderer[] = [];

  afterEach(async () => {
    setPlatform(originalOS);
    StatusBar.currentHeight = originalHeight;
    NativeModules.StatusBarManager = originalStatusBarManager;

    await TestRenderer.act(async () => {
      for (const tree of trees) {
        tree.unmount();
      }
      trees.length = 0;
    });
  });

  it('en Android evita que el contenido quede bajo las barras del sistema', async () => {
    setPlatform('android');
    StatusBar.currentHeight = 24;

    const tree = await renderScreen();
    trees.push(tree);
    const [root, body] = tree.root.findAllByType(View);

    expect(styleOf(root).paddingTop).toBe(24);
    expect(styleOf(body).paddingBottom).toBe(48);
  });

  it('en Android sin altura de status bar no inventa un inset', async () => {
    setPlatform('android');
    StatusBar.currentHeight = undefined;

    const tree = await renderScreen();
    trees.push(tree);

    expect(styleOf(tree.root.findAllByType(View)[0]).paddingTop).toBe(0);
  });

  it('en iOS usa la altura nativa del status bar, o 47 si no está', async () => {
    setPlatform('ios');

    NativeModules.StatusBarManager = { HEIGHT: 50 };
    const withNative = await renderScreen();
    trees.push(withNative);
    expect(styleOf(withNative.root.findAllByType(View)[0]).paddingTop).toBe(50);
    expect(styleOf(withNative.root.findAllByType(View)[1]).paddingBottom).toBe(
      0,
    );

    NativeModules.StatusBarManager = {};
    const fallback = await renderScreen();
    trees.push(fallback);
    expect(styleOf(fallback.root.findAllByType(View)[0]).paddingTop).toBe(47);
  });
});
