import type { CacheStore } from '../src/domain/CacheStore';
import type {
  Pokemon,
  PokemonDetail,
  PokemonRepository,
} from '../src/domain/Pokemon';
import { CachedPokemonRepository } from '../src/infrastructure/CachedPokemonRepository';

class MemoryCacheStore implements CacheStore {
  private readonly data = new Map<string, string>();
  reads = 0;

  get size() {
    return this.data.size;
  }

  async get<T>(key: string): Promise<T | null> {
    this.reads += 1;
    const raw = this.data.get(key);
    return raw === undefined ? null : (JSON.parse(raw) as T);
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.data.set(key, JSON.stringify(value));
  }
}

class FakePokemonRepository implements PokemonRepository {
  listCalls = 0;
  getByIdCalls = 0;
  listError: Error | null = null;
  detailError: Error | null = null;

  constructor(
    private readonly pokemon: Pokemon[],
    private readonly detail: PokemonDetail,
  ) {}

  async list(): Promise<Pokemon[]> {
    this.listCalls += 1;
    if (this.listError) {
      throw this.listError;
    }
    return this.pokemon;
  }

  async getById(): Promise<PokemonDetail> {
    this.getByIdCalls += 1;
    if (this.detailError) {
      throw this.detailError;
    }
    return this.detail;
  }
}

const bulbasaur: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.com/1.png',
  types: ['grass', 'poison'],
  heightMeters: 0.7,
  weightKilograms: 6.9,
};

const bulbasaurDetail: PokemonDetail = {
  ...bulbasaur,
  description: 'Una semilla extraña le fue plantada en el lomo al nacer.',
  genus: 'Pokémon Semilla',
  abilities: [{ name: 'Espesura', isHidden: false }],
  stats: [{ name: 'hp', value: 45 }],
  baseExperience: 64,
  habitat: 'grassland',
  captureRate: 45,
  eggGroups: ['monster', 'plant'],
  genderRate: 1,
  isLegendary: false,
  isMythical: false,
  generation: 'generation-i',
  growthRate: 'medium-slow',
};

function createSut(now: () => number, ttlMs = 1_000) {
  const remote = new FakePokemonRepository([bulbasaur], bulbasaurDetail);
  const cache = new MemoryCacheStore();
  const repository = new CachedPokemonRepository(remote, cache, ttlMs, now);

  return { remote, cache, repository };
}

describe('CachedPokemonRepository', () => {
  it('consulta la red y persiste cuando no hay cache', async () => {
    const { remote, repository } = createSut(() => 0);

    const result = await repository.list({ limit: 20, offset: 0 });

    expect(result).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(1);
  });

  it('devuelve el cache vigente sin volver a la red', async () => {
    let now = 0;
    const { remote, repository } = createSut(() => now, 1_000);

    await repository.list({ limit: 20, offset: 0 });
    now = 500;
    const result = await repository.list({ limit: 20, offset: 0 });

    expect(result).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(1);
  });

  it('refresca el cache cuando está vencido', async () => {
    let now = 0;
    const { remote, repository } = createSut(() => now, 1_000);

    await repository.getById(1);
    now = 1_001;
    const result = await repository.getById(1);

    expect(result).toEqual(bulbasaurDetail);
    expect(remote.getByIdCalls).toBe(2);
  });

  it('sirve datos vencidos si la red falla', async () => {
    let now = 0;
    const { remote, repository } = createSut(() => now, 1_000);

    await repository.list({ limit: 20, offset: 0 });
    now = 1_001;
    remote.listError = new Error('network');

    const result = await repository.list({ limit: 20, offset: 0 });

    expect(result).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(2);
  });

  it('propaga el error si no hay cache ni red', async () => {
    const { remote, repository } = createSut(() => 0);
    remote.detailError = new Error('network');

    await expect(repository.getById(1)).rejects.toThrow('network');
  });

  it('también persiste páginas siguientes del listado', async () => {
    const { remote, repository } = createSut(() => 0);

    await repository.list({ limit: 20, offset: 20 });
    const result = await repository.list({ limit: 20, offset: 20 });

    expect(result).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(1);
  });

  it('hidrata desde persistencia si la instancia no tiene memoria', async () => {
    const remote = new FakePokemonRepository([bulbasaur], bulbasaurDetail);
    const cache = new MemoryCacheStore();
    const first = new CachedPokemonRepository(remote, cache, 1_000, () => 0);

    await first.list({ limit: 20, offset: 0 });

    const second = new CachedPokemonRepository(remote, cache, 1_000, () => 0);
    const result = await second.list({ limit: 20, offset: 0 });

    expect(result).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(1);
  });

  it('sirve desde memoria sin volver a persistencia ni red', async () => {
    const { remote, cache, repository } = createSut(() => 0);

    await repository.list({ limit: 20, offset: 0 });
    const readsAfterFirst = cache.reads;
    const result = await repository.list({ limit: 20, offset: 0 });

    expect(result).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(1);
    expect(cache.reads).toBe(readsAfterFirst);
  });

  it('comparte una sola petición remota si hay lecturas concurrentes', async () => {
    const { remote, repository } = createSut(() => 0);

    const [first, second] = await Promise.all([
      repository.list({ limit: 20, offset: 0 }),
      repository.list({ limit: 20, offset: 0 }),
    ]);

    expect(first).toEqual([bulbasaur]);
    expect(second).toEqual([bulbasaur]);
    expect(remote.listCalls).toBe(1);
  });
});
