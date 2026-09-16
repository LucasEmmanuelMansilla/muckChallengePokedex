import { GetPokemon } from '../src/application/getPokemon';
import { ListPokemon } from '../src/application/listPokemon';
import { AsyncStorageCacheStore } from '../src/infrastructure/AsyncStorageCacheStore';
import { CachedPokemonRepository } from '../src/infrastructure/CachedPokemonRepository';
import { CachingHttpClient } from '../src/infrastructure/CachingHttpClient';
import { FetchHttpClient } from '../src/infrastructure/FetchHttpClient';
import { PokeApiPokemonRepository } from '../src/infrastructure/PokeApiPokemonRepository';
import {
  bulbasaurApi,
  listPayload,
  pokeApiRoutes,
  stubFetch,
} from './fixtures/pokeapi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const originalFetch = globalThis.fetch;

function createGraph(now = () => 0) {
  const httpClient = new CachingHttpClient(
    new FetchHttpClient('https://pokeapi.co/api/v2', 6000),
  );

  const repository = new CachedPokemonRepository(
    new PokeApiPokemonRepository(httpClient),
    new AsyncStorageCacheStore(),
    24 * 60 * 60 * 1000,
    now,
  );

  return {
    httpClient,
    listPokemon: new ListPokemon(repository),
    getPokemon: new GetPokemon(repository),
  };
}

describe('Pokédex integrada', () => {
  afterEach(async () => {
    globalThis.fetch = originalFetch;
    await AsyncStorage.clear();
  });

  it('lista y abre una ficha mapeando la forma real de PokéAPI', async () => {
    stubFetch(pokeApiRoutes(bulbasaurApi));
    const { listPokemon, getPokemon } = createGraph();

    const page = await listPokemon.execute();
    const detail = await getPokemon.execute(1);

    expect(page.items).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png',
        types: ['grass', 'poison'],
        heightMeters: 0.7,
        weightKilograms: 6.9,
      },
    ]);
    expect(page.hasMore).toBe(false);
    expect(detail.description).toBe(
      'Una semilla extraña le fue plantada en el lomo al nacer.',
    );
    expect(detail.genus).toBe('Pokémon Semilla');
    expect(detail.abilities).toEqual([
      { name: 'Espesura', isHidden: false },
      { name: 'Clorofila', isHidden: true },
    ]);
  });

  it('el listado y la ficha reutilizan el GET /pokemon/{id} de la sesión', async () => {
    stubFetch(pokeApiRoutes(bulbasaurApi));
    const { listPokemon, getPokemon } = createGraph();

    await listPokemon.execute();
    const callsAfterList = jest.mocked(globalThis.fetch).mock.calls.length;
    await getPokemon.execute(1);

    const pokemonDetailCalls = jest
      .mocked(globalThis.fetch)
      .mock.calls.filter(([url]) =>
        String(url).endsWith('/api/v2/pokemon/1'),
      );

    expect(pokemonDetailCalls).toHaveLength(1);
    expect(jest.mocked(globalThis.fetch).mock.calls.length).toBeGreaterThan(
      callsAfterList,
    );
  });

  it('tras un reinicio lee el listado desde persistencia sin volver a la red', async () => {
    stubFetch(pokeApiRoutes(bulbasaurApi));
    const first = createGraph();
    await first.listPokemon.execute();
    jest.mocked(globalThis.fetch).mockClear();

    const second = createGraph();
    const page = await second.listPokemon.execute();

    expect(page.items[0]?.name).toBe('bulbasaur');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('si la red cae después de cachear, sigue sirviendo la Pokédex', async () => {
    stubFetch(pokeApiRoutes(bulbasaurApi));
    let now = 0;
    const { listPokemon } = createGraph(() => now);

    await listPokemon.execute();
    now = 25 * 60 * 60 * 1000;
    globalThis.fetch = jest.fn(async () => {
      throw new Error('network');
    }) as jest.Mock;

    const page = await listPokemon.execute();

    expect(page.items[0]?.name).toBe('bulbasaur');
  });

  it('sin cache, un HTTP 500 impide armar el listado', async () => {
    stubFetch(
      {
        '/api/v2/pokemon?limit=20&offset=0': listPayload([bulbasaurApi]),
      },
      500,
    );
    const { listPokemon } = createGraph();

    await expect(listPokemon.execute()).rejects.toThrow('HTTP 500');
  });
});
