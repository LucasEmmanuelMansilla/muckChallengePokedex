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

/**
 * Caché del modelo de dominio (no del JSON de PokéAPI). Memoria para el
 * session, AsyncStorage para reabrir la app. El HTTP cacheado no alcanza:
 * ahí el dato aún no está mapeado y muere al matar el proceso.
 */
export class CachedPokemonRepository implements PokemonRepository {
  private readonly memory = new Map<string, CacheEntry<unknown>>();
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(
    private readonly remote: PokemonRepository,
    private readonly cache: CacheStore,
    private readonly ttlMs: number,
    // Inyectable para tests de TTL sin fake timers globales.
    private readonly now: () => number = Date.now,
  ) {}

  list(params: PokemonListParams): Promise<Pokemon[]> {
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
    const memoryEntry = this.memory.get(key) as CacheEntry<T> | undefined;
    if (memoryEntry && this.now() - memoryEntry.storedAt < this.ttlMs) {
      return memoryEntry.value;
    }

    const pending = this.inflight.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    const request = this.load(key, fetchFresh, memoryEntry);
    this.inflight.set(key, request);

    try {
      return await request;
    } finally {
      this.inflight.delete(key);
    }
  }

  private async load<T>(
    key: string,
    fetchFresh: () => Promise<T>,
    memoryEntry: CacheEntry<T> | undefined,
  ): Promise<T> {
    const entry =
      memoryEntry ?? (await this.cache.get<CacheEntry<T>>(key)) ?? undefined;

    // PokéAPI es estable: cache vigente evita red y mantiene la misma ficha.
    if (entry && this.now() - entry.storedAt < this.ttlMs) {
      this.memory.set(key, entry);
      return entry.value;
    }

    try {
      const fresh = await fetchFresh();
      const next: CacheEntry<T> = {
        storedAt: this.now(),
        value: fresh,
      };
      this.memory.set(key, next);
      await this.cache.set(key, next);
      return fresh;
    } catch (error) {
      // Offline parcial: si hay dato previo se sirve aunque esté vencido.
      if (entry) {
        this.memory.set(key, entry);
        return entry.value;
      }

      throw error;
    }
  }
}

// Prefijo versionado: un cambio de forma del modelo se descarta sin migración.
const CACHE_VERSION = 'v1';

function listCacheKey({ limit, offset }: PokemonListParams): string {
  return `pokedex:${CACHE_VERSION}:pokemon:list:${limit}:${offset}`;
}

function detailCacheKey(id: number): string {
  return `pokedex:${CACHE_VERSION}:pokemon:detail:${id}`;
}
