/**
 * KV persistente sin TTL: la política (caducidad, fallback offline) vive
 * en el repositorio cacheado. Así se puede cambiar AsyncStorage por otro
 * store sin mover reglas de negocio.
 */
export interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
}

