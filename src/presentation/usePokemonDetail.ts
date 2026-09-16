import { usePokemonUseCases } from '../di/PokemonUseCasesContext';
import { useRemoteData } from './useRemoteData';

export function usePokemonDetail(id: number) {
  const { getPokemon } = usePokemonUseCases();
  const { data, isLoading } = useRemoteData(
    () => getPokemon.execute(id),
    id,
    'detail',
  );

  return {
    pokemon: data,
    isLoading: isLoading && !data,
  };
}
