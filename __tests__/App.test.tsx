/**
 * @format
 */

import React from 'react';
import { FlatList, Pressable } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import HomeScreen from '../screens/HomeScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import { getPokemon, listPokemon } from '../src/di/container';
import {
  NavigationProvider,
  useNavigation,
} from '../src/navigation/NavigationContext';
import {
  bulbasaur,
  bulbasaurDetail,
  listPage,
} from './fixtures/pokemon';
import {
  activeScreen,
  pressA11y,
  pressText,
  render,
  textOf,
} from './helpers/render';

jest.mock('../src/di/container', () => ({
  listPokemon: {
    execute: jest.fn(),
  },
  getPokemon: {
    execute: jest.fn(),
  },
}));

const listExecute = listPokemon.execute as jest.Mock;
const getExecute = getPokemon.execute as jest.Mock;
const trees: ReactTestRenderer.ReactTestRenderer[] = [];

async function renderApp(element: React.ReactElement) {
  const tree = await render(element);
  trees.push(tree);
  return tree;
}

const firstPage = listPage(
  Array.from({ length: 20 }, (_, index) => ({
    ...bulbasaur,
    id: index + 1,
    name: index === 0 ? 'bulbasaur' : `pokemon-${index + 1}`,
  })),
  true,
);

const cardLabel = 'Ver ficha de Bulbasaur, N.º 0001, Planta, Veneno';

function RetryControl() {
  const { retry } = useNavigation();
  return (
    <Pressable accessibilityLabel="forzar-retry" onPress={retry} />
  );
}

describe('flujos de la app', () => {
  afterEach(async () => {
    listExecute.mockReset();
    getExecute.mockReset();
    await ReactTestRenderer.act(async () => {
      while (trees.length > 0) {
        trees.pop()?.unmount();
      }
    });
  });

  it('muestra el listado cuando PokéAPI responde', async () => {
    listExecute.mockResolvedValue(listPage([bulbasaur]));

    const tree = await renderApp(<App />);

    expect(textOf(activeScreen(tree))).toContain('Pokédex');
    expect(textOf(activeScreen(tree))).toContain('Bulbasaur');
    expect(textOf(activeScreen(tree))).toContain('N.º 0001');
    expect(textOf(activeScreen(tree))).not.toContain('Cargando Pokédex…');
  });

  it('al elegir un Pokémon abre la ficha traducida', async () => {
    listExecute.mockResolvedValue(listPage([bulbasaur]));
    getExecute.mockResolvedValue(bulbasaurDetail);

    const tree = await renderApp(<App />);
    await pressA11y(tree, cardLabel);

    const screen = textOf(activeScreen(tree));
    expect(getExecute).toHaveBeenCalledWith(1);
    expect(screen).toContain('Bulbasaur');
    expect(screen).toContain('Pokémon Semilla');
    expect(screen).toContain(
      'Una semilla extraña le fue plantada en el lomo al nacer.',
    );
    expect(screen).toContain('Espesura');
    expect(screen).toContain('Oculta');
    expect(screen).toContain('Pradera');
    expect(screen).toContain('Generación I');
    expect(screen).toContain('Medio-lento');
  });

  it('volver desde la ficha deja el listado visible', async () => {
    listExecute.mockResolvedValue(listPage([bulbasaur]));
    getExecute.mockResolvedValue(bulbasaurDetail);

    const tree = await renderApp(<App />);
    await pressA11y(tree, cardLabel);
    expect(textOf(activeScreen(tree))).toContain('Pokémon Semilla');

    await pressA11y(activeScreen(tree), 'Volver al listado');

    expect(textOf(activeScreen(tree))).toContain('Bulbasaur');
    expect(textOf(activeScreen(tree))).not.toContain('Pokémon Semilla');
  });

  it('si el listado falla, reintentar vuelve a pedir la primera página', async () => {
    listExecute
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(listPage([bulbasaur]));

    const tree = await renderApp(<App />);

    expect(textOf(activeScreen(tree))).toContain(
      '¡La Pokebola se abrió mal!',
    );

    await pressText(tree, 'Reintentar captura');

    expect(listExecute).toHaveBeenCalledTimes(2);
    expect(textOf(activeScreen(tree))).toContain('Bulbasaur');
  });

  it('un error al cargar más no tira el listado ya visto', async () => {
    listExecute
      .mockResolvedValueOnce(firstPage)
      .mockRejectedValueOnce(new Error('network'));

    const tree = await renderApp(<App />);
    const list = tree.root.findByType(FlatList);

    await ReactTestRenderer.act(async () => {
      list.props.onEndReached();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(textOf(activeScreen(tree))).toContain(
      '¡La Pokebola se abrió mal!',
    );

    listExecute.mockResolvedValue(listPage([bulbasaur], false));
    await pressText(tree, 'Reintentar captura');

    expect(textOf(activeScreen(tree))).toContain('Bulbasaur');
    expect(listExecute.mock.calls[0][0] ?? 0).toBe(0);
  });

  it('pide la página siguiente y no duplica si el offset se solapa', async () => {
    listExecute
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(listPage([bulbasaur], false));

    const tree = await renderApp(<App />);
    const list = tree.root.findByType(FlatList);

    await ReactTestRenderer.act(async () => {
      list.props.onEndReached();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(listExecute).toHaveBeenLastCalledWith(20);
    expect(
      tree.root.findByType(FlatList).props.data.filter(
        (item: { id: number }) => item.id === 1,
      ),
    ).toHaveLength(1);
  });

  it('no pide otra página cuando el listado ya está completo', async () => {
    listExecute.mockResolvedValue(listPage([bulbasaur], false));

    const tree = await renderApp(<App />);
    const list = tree.root.findByType(FlatList);

    await ReactTestRenderer.act(async () => {
      list.props.onEndReached();
    });
    expect(listExecute).toHaveBeenCalledTimes(1);
  });

  it('una sola petición de loadMore queda en vuelo', async () => {
    let resolveMore: (value: unknown) => void = () => {};
    listExecute
      .mockResolvedValueOnce(firstPage)
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolveMore = resolve;
          }),
      );

    const tree = await renderApp(<App />);
    const list = tree.root.findByType(FlatList);

    await ReactTestRenderer.act(async () => {
      list.props.onEndReached();
      list.props.onEndReached();
    });

    expect(textOf(tree.root)).toContain('Cargando más Pokémon…');
    expect(listExecute).toHaveBeenCalledTimes(2);

    await ReactTestRenderer.act(async () => {
      resolveMore(
        listPage([{ ...bulbasaur, id: 21, name: 'spearow' }], false),
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(
      tree.root
        .findByType(FlatList)
        .props.data.map((item: { name: string }) => item.name),
    ).toContain('spearow');
  });

  it('si la ficha falla, el error se puede reintentar', async () => {
    listExecute.mockResolvedValue(listPage([bulbasaur]));
    getExecute
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(bulbasaurDetail);

    const tree = await renderApp(<App />);
    await pressA11y(tree, cardLabel);

    expect(textOf(activeScreen(tree))).toContain(
      '¡La Pokebola se abrió mal!',
    );

    await pressText(tree, 'Reintentar captura');

    expect(getExecute).toHaveBeenCalledTimes(2);
    expect(textOf(activeScreen(tree))).toContain('Pokémon Semilla');
  });

  it('ignora una página vieja si el listado se reintenta en vuelo', async () => {
    let resolveFirst: (value: unknown) => void = () => {};
    listExecute
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce(listPage([bulbasaur]));

    const tree = await renderApp(
      <NavigationProvider>
        <HomeScreen />
        <RetryControl />
      </NavigationProvider>,
    );

    await pressA11y(tree, 'forzar-retry');
    await ReactTestRenderer.act(async () => {
      resolveFirst(
        listPage([{ ...bulbasaur, id: 4, name: 'charmander' }]),
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(textOf(tree.root)).toContain('Bulbasaur');
    expect(textOf(tree.root)).not.toContain('Charmander');
  });

  it('desde la carga de la ficha también se puede volver', async () => {
    listExecute.mockResolvedValue(listPage([bulbasaur]));
    getExecute.mockImplementation(() => new Promise(() => {}));

    const tree = await renderApp(<App />);
    await pressA11y(tree, cardLabel);

    expect(textOf(activeScreen(tree))).toContain('Cargando ficha…');
    await pressA11y(tree, 'Volver al listado');
    expect(textOf(activeScreen(tree))).toContain('Bulbasaur');
  });

  it('un error tardío del listado no pisa un reintento que ya funcionó', async () => {
    let rejectFirst: (error: Error) => void = () => {};
    listExecute
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectFirst = reject;
          }),
      )
      .mockResolvedValueOnce(listPage([bulbasaur]));

    const tree = await renderApp(
      <NavigationProvider>
        <HomeScreen />
        <RetryControl />
      </NavigationProvider>,
    );

    await pressA11y(tree, 'forzar-retry');
    await ReactTestRenderer.act(async () => {
      rejectFirst(new Error('network'));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(textOf(tree.root)).toContain('Bulbasaur');
    expect(textOf(tree.root)).not.toContain('¡La Pokebola se abrió mal!');
  });

  it('al reintentar una ficha ya visible no la reemplaza por el spinner', async () => {
    getExecute.mockResolvedValue(bulbasaurDetail);

    const tree = await renderApp(
      <NavigationProvider>
        <PokemonDetailScreen pokemonId={1} />
        <RetryControl />
      </NavigationProvider>,
    );

    expect(textOf(tree.root)).toContain('Pokémon Semilla');
    await pressA11y(tree, 'forzar-retry');

    expect(getExecute).toHaveBeenCalledTimes(2);
    expect(textOf(tree.root)).toContain('Pokémon Semilla');
    expect(textOf(tree.root)).not.toContain('Cargando ficha…');
  });

  it('no pisa la ficha si la pantalla se desmontó a mitad de carga', async () => {
    let resolveDetail: (value: unknown) => void = () => {};
    getExecute.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveDetail = resolve;
        }),
    );

    const tree = await renderApp(
      <NavigationProvider>
        <PokemonDetailScreen pokemonId={1} />
      </NavigationProvider>,
    );

    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });

    await ReactTestRenderer.act(async () => {
      resolveDetail(bulbasaurDetail);
      await Promise.resolve();
      await Promise.resolve();
    });
  });

  it('no navega a error si la ficha se desmontó con la petición fallida', async () => {
    let rejectDetail: (error: Error) => void = () => {};
    getExecute.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectDetail = reject;
        }),
    );

    const tree = await renderApp(
      <NavigationProvider>
        <PokemonDetailScreen pokemonId={1} />
      </NavigationProvider>,
    );

    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });

    await ReactTestRenderer.act(async () => {
      rejectDetail(new Error('network'));
      await Promise.resolve();
      await Promise.resolve();
    });
  });

  it('una página vacía al paginar deja el listado intacto', async () => {
    listExecute
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(listPage([], false));

    const tree = await renderApp(<App />);
    const list = tree.root.findByType(FlatList);

    await ReactTestRenderer.act(async () => {
      list.props.onEndReached();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(tree.root.findByType(FlatList).props.data).toHaveLength(20);
  });
});
