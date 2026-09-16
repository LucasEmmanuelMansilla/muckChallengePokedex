import { listPokemon } from '../di/container';
import { useRemoteData } from './useRemoteData';

export function usePokemonList() {
  const { data, isLoading } = useRemoteData(
    () => listPokemon.execute(),
    'pokemon-list',
  );

  return {
    pokemon: data ?? [],
    isLoading,
  };
}
