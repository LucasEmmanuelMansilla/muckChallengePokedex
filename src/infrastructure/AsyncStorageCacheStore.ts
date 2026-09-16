import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CacheStore } from '../domain/CacheStore';

// React Native no trae KV persistente: AsyncStorage es la excepción justificada.
// Los payloads son JSON pequeño (listado y fichas); el TTL y el fallback
// offline viven en CachedPokemonRepository para no mezclar I/O con política.
export class AsyncStorageCacheStore implements CacheStore {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      // Una entrada corrupta no debe tumbar la app ni bloquear el fetch.
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}
