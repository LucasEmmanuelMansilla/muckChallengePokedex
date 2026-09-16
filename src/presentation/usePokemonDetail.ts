import { getPokemon } from '../di/container';
import { useRemoteData } from './useRemoteData';

export function usePokemonDetail(id: number) {
  const { data, isLoading } = useRemoteData(
    () => getPokemon.execute(id),
    id,
  );

  return {
    pokemon: data,
    isLoading: isLoading && !data,
  };
}
