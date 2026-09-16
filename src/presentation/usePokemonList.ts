import { useQuery } from '@tanstack/react-query';
import { listPokemon } from '../di/container';
import { usePokemonStore } from './pokemonStore';

export const pokemonListQueryKey = ['pokemon', 'list'] as const;

export function usePokemonList() {
  const pokemon = usePokemonStore(state => state.pokemon);

  const query = useQuery({
    queryKey: pokemonListQueryKey,
    queryFn: async () => {
      const result = await listPokemon.execute();
      usePokemonStore.getState().setPokemon(result);
      return result;
    },
  });

  return {
    pokemon,
    isLoading: query.isPending || (query.isFetching && pokemon.length === 0),
    isError: query.isError,
  };
}
