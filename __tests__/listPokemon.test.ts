import { ListPokemon } from '../src/application/listPokemon';
import type { Pokemon, PokemonDetail, PokemonRepository } from '../src/domain/Pokemon';

const bulbasaur: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.com/1.png',
  types: ['grass', 'poison'],
  heightMeters: 0.7,
  weightKilograms: 6.9,
};

class FakePokemonRepository implements PokemonRepository {
  lastParams: { limit: number; offset: number } | null = null;

  constructor(private readonly items: Pokemon[]) {}

  async list(params: { limit: number; offset: number }): Promise<Pokemon[]> {
    this.lastParams = params;
    return this.items;
  }

  async getById(): Promise<PokemonDetail> {
    throw new Error('no usado');
  }
}

describe('ListPokemon', () => {
  it('pide la primera página de 20', async () => {
    const items = Array.from({ length: 20 }, (_, index) => ({
      ...bulbasaur,
      id: index + 1,
    }));
    const repository = new FakePokemonRepository(items);
    const useCase = new ListPokemon(repository);

    const page = await useCase.execute();

    expect(repository.lastParams).toEqual({ limit: 20, offset: 0 });
    expect(page.items).toHaveLength(20);
    expect(page.hasMore).toBe(true);
  });

  it('pide la página siguiente por offset y detecta el final', async () => {
    const repository = new FakePokemonRepository([bulbasaur]);
    const useCase = new ListPokemon(repository);

    const page = await useCase.execute(20);

    expect(repository.lastParams).toEqual({ limit: 20, offset: 20 });
    expect(page.items).toEqual([bulbasaur]);
    expect(page.hasMore).toBe(false);
  });
});
