import { GetPokemon } from '../application/getPokemon';
import { ListPokemon } from '../application/listPokemon';
import { AsyncStorageCacheStore } from '../infrastructure/AsyncStorageCacheStore';
import { CachedPokemonRepository } from '../infrastructure/CachedPokemonRepository';
import { FetchHttpClient } from '../infrastructure/FetchHttpClient';
import { PokeApiPokemonRepository } from '../infrastructure/PokeApiPokemonRepository';

const POKEMON_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const httpClient = new FetchHttpClient('https://pokeapi.co/api/v2', 6000);

const pokemonRepository = new CachedPokemonRepository(
  new PokeApiPokemonRepository(httpClient),
  new AsyncStorageCacheStore(),
  POKEMON_CACHE_TTL_MS,
);

export const listPokemon = new ListPokemon(pokemonRepository);
export const getPokemon = new GetPokemon(pokemonRepository);
