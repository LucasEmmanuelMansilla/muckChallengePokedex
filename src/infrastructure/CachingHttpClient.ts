import type { HttpClient } from '../domain/HttpClient';

// PokéAPI es inmutable a escala de sesión: el listado pide /pokemon/{id}
// y la ficha lo vuelve a pedir; varias fichas comparten /ability/{name}.
export class CachingHttpClient implements HttpClient {
  private readonly values = new Map<string, unknown>();
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(private readonly inner: HttpClient) {}

  get<T>(
    path: string,
    query?: Record<string, string | number>,
  ): Promise<T> {
    const key = requestKey(path, query);
    const cached = this.values.get(key);
    if (cached !== undefined) {
      return Promise.resolve(cached as T);
    }

    const pending = this.inflight.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    const request = this.inner
      .get<T>(path, query)
      .then(value => {
        this.values.set(key, value);
        return value;
      })
      .finally(() => {
        this.inflight.delete(key);
      });

    this.inflight.set(key, request);
    return request;
  }
}

function requestKey(
  path: string,
  query?: Record<string, string | number>,
): string {
  if (!query) {
    return path;
  }

  const params = Object.entries(query)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}=${value}`)
    .join('&');

  return `${path}?${params}`;
}
