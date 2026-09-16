import { listPokemon, getPokemon } from '../src/di/container';
import { bulbasaurApi, pokeApiRoutes, stubFetch } from './fixtures/pokeapi';

const originalFetch = globalThis.fetch;

describe('composition root', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('lista y obtiene una ficha con el grafo real de la app', async () => {
    stubFetch(pokeApiRoutes(bulbasaurApi));

    const page = await listPokemon.execute();
    const detail = await getPokemon.execute(1);

    expect(page.items[0]?.name).toBe('bulbasaur');
    expect(detail.abilities[0]?.name).toBe('Espesura');
  });
});
