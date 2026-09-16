import { GetPokemon } from '../src/application/getPokemon';
import { AppError } from '../src/domain/AppError';
import type {
  Pokemon,
  PokemonDetail,
  PokemonRepository,
} from '../src/domain/Pokemon';

const bulbasaurDetail: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.com/1.png',
  types: ['grass'],
  heightMeters: 0.7,
  weightKilograms: 6.9,
  description: 'Semilla',
  genus: 'Pokémon Semilla',
  abilities: [],
  stats: [],
  baseExperience: 64,
  habitat: 'grassland',
  captureRate: 45,
  eggGroups: ['monster'],
  genderRate: 1,
  isLegendary: false,
  isMythical: false,
  generation: 'generation-i',
  growthRate: 'medium-slow',
};

class FakePokemonRepository implements PokemonRepository {
  getByIdCalls: number[] = [];

  async list(): Promise<Pokemon[]> {
    throw new Error('no usado');
  }

  async getById(id: number): Promise<PokemonDetail> {
    this.getByIdCalls.push(id);
    return bulbasaurDetail;
  }
}

describe('GetPokemon', () => {
  it('pide la ficha al repositorio', async () => {
    const repository = new FakePokemonRepository();
    const useCase = new GetPokemon(repository);

    await expect(useCase.execute(1)).resolves.toEqual(bulbasaurDetail);
    expect(repository.getByIdCalls).toEqual([1]);
  });

  it('no consulta la API si el id no es un Pokémon válido', async () => {
    const repository = new FakePokemonRepository();
    const useCase = new GetPokemon(repository);

    await expect(useCase.execute(0)).rejects.toMatchObject({
      name: 'AppError',
      code: 'not_found',
    });
    await expect(useCase.execute(1.5)).rejects.toBeInstanceOf(AppError);
    expect(repository.getByIdCalls).toEqual([]);
  });
});
