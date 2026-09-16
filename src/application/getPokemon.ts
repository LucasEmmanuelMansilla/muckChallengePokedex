import type { PokemonDetail, PokemonRepository } from '../domain/Pokemon';

export class GetPokemon {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute(id: number): Promise<PokemonDetail> {
    return this.pokemonRepository.getById(id);
  }
}
