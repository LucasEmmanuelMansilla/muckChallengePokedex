import type { Pokemon, PokemonRepository } from '../domain/Pokemon';

const FIRST_PAGE_LIMIT = 20;

export class ListPokemon {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  execute(): Promise<Pokemon[]> {
    return this.pokemonRepository.list({
      limit: FIRST_PAGE_LIMIT,
      offset: 0,
    });
  }
}
