jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();

  const api = {
    getItem: jest.fn(async key => store.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    clear: jest.fn(async () => {
      store.clear();
    }),
  };

  return api;
});

beforeEach(async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  await AsyncStorage.clear();
  AsyncStorage.getItem.mockClear();
  AsyncStorage.setItem.mockClear();
});
