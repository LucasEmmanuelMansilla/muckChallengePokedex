/**
 * Puente entre el composition root y la UI. Los hooks dependen de este
 * context y no de `container.ts`, así presentation no instancia adapters
 * y los tests pueden pasar casos de uso fake.
 */
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { GetPokemon } from '../application/getPokemon';
import type { ListPokemon } from '../application/listPokemon';

type PokemonUseCases = {
  listPokemon: ListPokemon;
  getPokemon: GetPokemon;
};

const PokemonUseCasesContext = createContext<PokemonUseCases | null>(null);

type PokemonUseCasesProviderProps = PokemonUseCases & {
  children: ReactNode;
};

export function PokemonUseCasesProvider({
  listPokemon,
  getPokemon,
  children,
}: PokemonUseCasesProviderProps) {
  const value = useMemo(
    () => ({ listPokemon, getPokemon }),
    [listPokemon, getPokemon],
  );

  return (
    <PokemonUseCasesContext.Provider value={value}>
      {children}
    </PokemonUseCasesContext.Provider>
  );
}

export function usePokemonUseCases() {
  const value = useContext(PokemonUseCasesContext);
  if (value === null) {
    throw new Error('usePokemonUseCases requiere PokemonUseCasesProvider');
  }
  return value;
}
