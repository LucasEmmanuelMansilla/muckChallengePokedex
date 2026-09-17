/**
 * Composition root: único sitio que conoce host, timeout y TTL.
 * Los hooks no importan este archivo; piden casos de uso por context
 * para poder inyectar fakes y no arrastrar infraestructura a la UI.
 */
import { GetPokemon } from '../application/getPokemon';
import { ListPokemon } from '../application/listPokemon';
import { AsyncStorageCacheStore } from '../infrastructure/AsyncStorageCacheStore';
import { CachedPokemonRepository } from '../infrastructure/CachedPokemonRepository';
import { CachingHttpClient } from '../infrastructure/CachingHttpClient';
import { FetchHttpClient } from '../infrastructure/FetchHttpClient';
import { PokeApiPokemonRepository } from '../infrastructure/PokeApiPokemonRepository';

const POKEMON_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Dos cachés a propósito: JSON crudo por URL (sesión) vs agregado de dominio
// persistente. Deduplicar HTTP y sobrevivir offline no son el mismo motivo.
const httpClient = new CachingHttpClient(
  // 6s: PokéAPI suele responder rápido; más tiempo deja el spinner colgado
  // en redes malas. AbortController es el timeout del runtime, sin lib extra.
  new FetchHttpClient('https://pokeapi.co/api/v2', 6000),
);

const pokemonRepository = new CachedPokemonRepository(
  new PokeApiPokemonRepository(httpClient),
  new AsyncStorageCacheStore(),
  POKEMON_CACHE_TTL_MS,
);

export const listPokemon = new ListPokemon(pokemonRepository);
export const getPokemon = new GetPokemon(pokemonRepository);
