import axios from 'axios';
import { GetPokemon } from '../application/getPokemon';
import { ListPokemon } from '../application/listPokemon';
import { AxiosHttpClient } from '../infrastructure/AxiosHttpClient';
import { PokeApiPokemonRepository } from '../infrastructure/PokeApiPokemonRepository';

const httpClient = new AxiosHttpClient(
  axios.create({ baseURL: 'https://pokeapi.co/api/v2' }),
);

const pokemonRepository = new PokeApiPokemonRepository(httpClient);

export const listPokemon = new ListPokemon(pokemonRepository);
export const getPokemon = new GetPokemon(pokemonRepository);
