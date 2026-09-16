import { FetchHttpClient } from '../src/infrastructure/FetchHttpClient';

describe('FetchHttpClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('hace GET con query y parsea JSON', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ results: [] }),
    })) as jest.Mock;

    const client = new FetchHttpClient('https://pokeapi.co/api/v2', 6000);
    const data = await client.get('/pokemon', { limit: 20, offset: 0 });

    expect(data).toEqual({ results: [] });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('lanza si la respuesta no es ok', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    })) as jest.Mock;

    const client = new FetchHttpClient('https://pokeapi.co/api/v2', 6000);

    await expect(client.get('/pokemon')).rejects.toThrow('HTTP 500');
  });
});
