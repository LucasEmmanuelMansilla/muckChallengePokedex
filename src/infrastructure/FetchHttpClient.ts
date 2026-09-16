import { AppError, toAppError } from '../domain/AppError';
import type { HttpClient } from '../domain/HttpClient';

export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
  ) {}

  async get<T>(
    path: string,
    query?: Record<string, string | number>,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(buildUrl(this.baseUrl, path, query), {
        method: 'GET',
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new AppError('not_found', 'HTTP 404');
        }

        throw new AppError('network', `HTTP ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      throw toAppError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, string | number>,
): string {
  const base = baseUrl.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${suffix}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}
