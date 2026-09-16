import type { CacheStore } from '../domain/CacheStore';
import type {
  Pokemon,
  PokemonDetail,
  PokemonListParams,
  PokemonRepository,
} from '../domain/Pokemon';

type CacheEntry<T> = {
  storedAt: number;
  value: T;
};

export class CachedPokemonRepository implements PokemonRepository {
  constructor(
    private readonly remote: PokemonRepository,
    private readonly cache: CacheStore,
    private readonly ttlMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  list(params: PokemonListParams): Promise<Pokemon[]> {
    // Solo la primera página se persiste; el resto del listado es de sesión.
    if (params.offset > 0) {
      return this.remote.list(params);
    }

    return this.readThrough(listCacheKey(params), () =>
      this.remote.list(params),
    );
  }

  getById(id: number): Promise<PokemonDetail> {
    return this.readThrough(detailCacheKey(id), () => this.remote.getById(id));
  }

  private async readThrough<T>(
    key: string,
    fetchFresh: () => Promise<T>,
  ): Promise<T> {
    const entry = await this.cache.get<CacheEntry<T>>(key);

    // PokéAPI es estable: cache vigente evita red y mantiene la misma ficha.
    if (entry !== null && this.now() - entry.storedAt < this.ttlMs) {
      return entry.value;
    }

    try {
      const fresh = await fetchFresh();
      await this.cache.set(key, {
        storedAt: this.now(),
        value: fresh,
      });
      return fresh;
    } catch (error) {
      // Offline parcial: si hay dato previo se sirve aunque esté vencido.
      if (entry) {
        return entry.value;
      }

      throw error;
    }
  }
}

const CACHE_VERSION = 'v1';

function listCacheKey({ limit, offset }: PokemonListParams): string {
  return `pokedex:${CACHE_VERSION}:pokemon:list:${limit}:${offset}`;
}

function detailCacheKey(id: number): string {
  return `pokedex:${CACHE_VERSION}:pokemon:detail:${id}`;
}
