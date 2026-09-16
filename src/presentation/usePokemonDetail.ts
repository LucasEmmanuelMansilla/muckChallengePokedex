import { useQuery } from '@tanstack/react-query';
import { getPokemon } from '../di/container';

export function pokemonDetailQueryKey(id: number) {
  return ['pokemon', 'detail', id] as const;
}

export function usePokemonDetail(id: number) {
  const query = useQuery({
    queryKey: pokemonDetailQueryKey(id),
    queryFn: () => getPokemon.execute(id),
  });

  return {
    pokemon: query.data,
    isLoading: query.isPending,
    isError: query.isError,
  };
}
