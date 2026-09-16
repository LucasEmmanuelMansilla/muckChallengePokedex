import type { Pokemon, PokemonRepository } from '../domain/Pokemon';

export const POKEMON_PAGE_SIZE = 20;

export type PokemonListPage = {
  items: Pokemon[];
  hasMore: boolean;
};

export class ListPokemon {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(offset = 0): Promise<PokemonListPage> {
    const items = await this.pokemonRepository.list({
      limit: POKEMON_PAGE_SIZE,
      offset,
    });

    return {
      items,
      hasMore: items.length === POKEMON_PAGE_SIZE,
    };
  }
}
