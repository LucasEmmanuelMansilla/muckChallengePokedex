import type { HttpClient } from '../src/domain/HttpClient';
import { CachingHttpClient } from '../src/infrastructure/CachingHttpClient';

class FakeHttpClient implements HttpClient {
  calls: Array<{ path: string; query?: Record<string, string | number> }> = [];
  error: Error | null = null;
  private readonly responses = new Map<string, unknown>();

  set(path: string, value: unknown, query?: Record<string, string | number>) {
    this.responses.set(key(path, query), value);
  }

  async get<T>(
    path: string,
    query?: Record<string, string | number>,
  ): Promise<T> {
    this.calls.push({ path, query });
    if (this.error) {
      throw this.error;
    }

    await Promise.resolve();
    return this.responses.get(key(path, query)) as T;
  }
}

function key(path: string, query?: Record<string, string | number>) {
  if (!query) {
    return path;
  }

  const params = Object.entries(query)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}=${value}`)
    .join('&');

  return `${path}?${params}`;
}

describe('CachingHttpClient', () => {
  it('devuelve el valor cacheado sin repetir la red', async () => {
    const inner = new FakeHttpClient();
    inner.set('/pokemon/1', { id: 1 });
    const client = new CachingHttpClient(inner);

    const first = await client.get('/pokemon/1');
    const second = await client.get('/pokemon/1');

    expect(first).toEqual({ id: 1 });
    expect(second).toEqual({ id: 1 });
    expect(inner.calls).toHaveLength(1);
  });

  it('trata la misma query en distinto orden como la misma petición', async () => {
    const inner = new FakeHttpClient();
    inner.set('/pokemon', { results: [] }, { limit: 20, offset: 0 });
    const client = new CachingHttpClient(inner);

    await client.get('/pokemon', { offset: 0, limit: 20 });
    await client.get('/pokemon', { limit: 20, offset: 0 });

    expect(inner.calls).toHaveLength(1);
  });

  it('distingue el mismo path con distinta query', async () => {
    const inner = new FakeHttpClient();
    inner.set('/pokemon', { offset: 0 }, { limit: 20, offset: 0 });
    inner.set('/pokemon', { offset: 20 }, { limit: 20, offset: 20 });
    const client = new CachingHttpClient(inner);

    const first = await client.get('/pokemon', { limit: 20, offset: 0 });
    const second = await client.get('/pokemon', { limit: 20, offset: 20 });

    expect(first).toEqual({ offset: 0 });
    expect(second).toEqual({ offset: 20 });
    expect(inner.calls).toHaveLength(2);
  });

  it('comparte la petición en vuelo', async () => {
    const inner = new FakeHttpClient();
    inner.set('/ability/overgrow', { name: 'overgrow' });
    const client = new CachingHttpClient(inner);

    const [first, second] = await Promise.all([
      client.get('/ability/overgrow'),
      client.get('/ability/overgrow'),
    ]);

    expect(first).toEqual({ name: 'overgrow' });
    expect(second).toEqual({ name: 'overgrow' });
    expect(inner.calls).toHaveLength(1);
  });

  it('no cachea errores para permitir reintentos', async () => {
    const inner = new FakeHttpClient();
    inner.error = new Error('network');
    const client = new CachingHttpClient(inner);

    await expect(client.get('/pokemon/1')).rejects.toThrow('network');

    inner.error = null;
    inner.set('/pokemon/1', { id: 1 });
    const result = await client.get('/pokemon/1');

    expect(result).toEqual({ id: 1 });
    expect(inner.calls).toHaveLength(2);
  });
});
