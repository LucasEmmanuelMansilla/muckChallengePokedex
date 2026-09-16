import { FetchHttpClient } from '../src/infrastructure/FetchHttpClient';

describe('FetchHttpClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.useRealTimers();
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

  it('acepta un path sin barra inicial y una base con barra final', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: 1 }),
    })) as jest.Mock;

    const client = new FetchHttpClient('https://pokeapi.co/api/v2/', 6000);
    await client.get('pokemon/1');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/1',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('corta la petición si supera el timeout', async () => {
    jest.useFakeTimers();
    globalThis.fetch = jest.fn(
      (_url: unknown, init?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) {
            return;
          }

          const onAbort = () => {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          };

          if (signal.aborted) {
            onAbort();
            return;
          }

          signal.addEventListener('abort', onAbort);
        }),
    ) as jest.Mock;

    const client = new FetchHttpClient('https://pokeapi.co/api/v2', 1000);
    const pending = client.get('/pokemon');
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
    });

    await jest.advanceTimersByTimeAsync(1000);
    await assertion;
    jest.useRealTimers();
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
