import { AppError } from '../domain/AppError';
import type { PokemonDetail, PokemonRepository } from '../domain/Pokemon';

export class GetPokemon {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute(id: number): Promise<PokemonDetail> {
    if (!Number.isInteger(id) || id < 1) {
      return Promise.reject(new AppError('not_found'));
    }

    return this.pokemonRepository.getById(id);
  }
}
