import type { Pokemon, PokemonRepository } from '../domain/Pokemon';

// 20 cards por página: alcanza para el viewport y limita el fan-out de
// /pokemon/{id} que el listado de PokéAPI no trae hidratado.
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
      // No usa `count` de PokéAPI: una página corta (o un mock) basta
      // para cortar. Si la última página llena exactamente 20, el siguiente
      // fetch vendrá vacío y `hasMore` se apaga ahí.
      hasMore: items.length === POKEMON_PAGE_SIZE,
    };
  }
}
