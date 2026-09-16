import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageCacheStore } from '../src/infrastructure/AsyncStorageCacheStore';

describe('AsyncStorageCacheStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persiste y recupera un payload JSON', async () => {
    const store = new AsyncStorageCacheStore();

    await store.set('pokedex:v1:list', { ids: [1, 2] });

    await expect(store.get('pokedex:v1:list')).resolves.toEqual({
      ids: [1, 2],
    });
  });

  it('devuelve null si la clave no existe', async () => {
    const store = new AsyncStorageCacheStore();

    await expect(store.get('missing')).resolves.toBeNull();
  });

  it('ignora una entrada corrupta para no bloquear el fetch', async () => {
    const store = new AsyncStorageCacheStore();
    await AsyncStorage.setItem('pokedex:v1:list', '{not-json');

    await expect(store.get('pokedex:v1:list')).resolves.toBeNull();
  });
});
