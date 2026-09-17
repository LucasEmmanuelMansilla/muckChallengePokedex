import { AppError } from '../domain/AppError';
import type { PokemonDetail, PokemonRepository } from '../domain/Pokemon';

/**
 * Valida el id aquí y no en el adapter: un id inválido es un caso de uso
 * mal invocado, no un 404 de red. Se mapea a `not_found` para reutilizar
 * el copy de ficha inexistente sin un estado de validación extra.
 */
export class GetPokemon {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute(id: number): Promise<PokemonDetail> {
    if (!Number.isInteger(id) || id < 1) {
      return Promise.reject(new AppError('not_found'));
    }

    return this.pokemonRepository.getById(id);
  }
}
