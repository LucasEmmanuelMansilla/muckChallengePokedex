import { create } from 'zustand';
import type { Pokemon } from '../domain/Pokemon';

type PokemonState = {
  pokemon: Pokemon[];
  setPokemon: (pokemon: Pokemon[]) => void;
};

export const usePokemonStore = create<PokemonState>(set => ({
  pokemon: [],
  setPokemon: pokemon => set({ pokemon }),
}));
