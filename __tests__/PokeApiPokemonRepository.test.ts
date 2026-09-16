import { PokeApiPokemonRepository } from '../src/infrastructure/PokeApiPokemonRepository';
import {
  RecordingHttpClient,
  abilityPayload,
  bulbasaurApi,
  listPayload,
  speciesPayload,
} from './fixtures/pokeapi';

describe('PokeApiPokemonRepository', () => {
  it('arma el listado con medidas, tipos ordenados y sprite por id', async () => {
    const http = new RecordingHttpClient();
    http.set('/pokemon', listPayload([bulbasaurApi]), {
      limit: 20,
      offset: 0,
    });
    http.seed(bulbasaurApi);
    const repository = new PokeApiPokemonRepository(http);

    const [pokemon] = await repository.list({ limit: 20, offset: 0 });

    expect(pokemon).toEqual({
      id: 1,
      name: 'bulbasaur',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png',
      types: ['grass', 'poison'],
      heightMeters: 0.7,
      weightKilograms: 6.9,
    });
  });

  it('arma la ficha en español, con habilidades ordenadas y flavor limpio', async () => {
    const http = new RecordingHttpClient();
    http.seed(bulbasaurApi);
    const repository = new PokeApiPokemonRepository(http);

    const detail = await repository.getById(1);

    expect(detail.description).toBe(
      'Una semilla extraña le fue plantada en el lomo al nacer.',
    );
    expect(detail.genus).toBe('Pokémon Semilla');
    expect(detail.abilities).toEqual([
      { name: 'Espesura', isHidden: false },
      { name: 'Clorofila', isHidden: true },
    ]);
    expect(detail.habitat).toBe('grassland');
    expect(detail.genderRate).toBe(1);
    expect(detail.stats[0]).toEqual({ name: 'hp', value: 45 });
  });

  it('cae a inglés si PokéAPI no trae español', async () => {
    const http = new RecordingHttpClient();
    http.seed({
      ...bulbasaurApi,
      species: {
        ...bulbasaurApi.species,
        flavorText: [
          {
            language: 'en',
            text: 'A strange seed was planted on its back at birth.',
          },
        ],
        genera: [{ language: 'en', genus: 'Seed Pokémon' }],
      },
      abilityNames: {
        overgrow: [{ language: 'en', name: 'Overgrow' }],
        chlorophyll: [{ language: 'en', name: 'Chlorophyll' }],
      },
    });
    const repository = new PokeApiPokemonRepository(http);

    const detail = await repository.getById(1);

    expect(detail.description).toBe(
      'A strange seed was planted on its back at birth.',
    );
    expect(detail.genus).toBe('Seed Pokémon');
    expect(detail.abilities[0]?.name).toBe('Overgrow');
  });

  it('usa el flavor más reciente de ese idioma', async () => {
    const http = new RecordingHttpClient();
    http.seed({
      ...bulbasaurApi,
      species: {
        ...bulbasaurApi.species,
        flavorText: [
          { language: 'es', text: 'Texto viejo de Rojo.' },
          { language: 'es', text: 'Texto nuevo de Espada.' },
        ],
      },
    });
    const repository = new PokeApiPokemonRepository(http);

    const detail = await repository.getById(1);

    expect(detail.description).toBe('Texto nuevo de Espada.');
  });

  it('omite hábitat y textos si la especie viene incompleta', async () => {
    const http = new RecordingHttpClient();
    http.set(`/pokemon/${bulbasaurApi.id}`, {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: null,
      types: [{ slot: 1, type: { name: 'grass' } }],
      abilities: [],
      stats: [],
    });
    http.set(
      `/pokemon-species/${bulbasaurApi.id}`,
      speciesPayload({
        ...bulbasaurApi,
        species: {
          ...bulbasaurApi.species,
          flavorText: [],
          genera: [],
          habitat: null,
        },
      }),
    );
    const repository = new PokeApiPokemonRepository(http);

    const detail = await repository.getById(1);

    expect(detail.description).toBe('');
    expect(detail.genus).toBe('');
    expect(detail.habitat).toBeNull();
    expect(detail.baseExperience).toBeNull();
    expect(detail.abilities).toEqual([]);
  });

  it('usa el nombre interno de la habilidad si no está localizada', async () => {
    const http = new RecordingHttpClient();
    http.seed({
      ...bulbasaurApi,
      abilities: [{ slot: 1, name: 'overgrow', hidden: false }],
      abilityNames: {
        overgrow: [],
      },
    });
    http.set('/ability/overgrow', abilityPayload([]));
    const repository = new PokeApiPokemonRepository(http);

    const detail = await repository.getById(1);

    expect(detail.abilities).toEqual([
      { name: 'overgrow', isHidden: false },
    ]);
  });
});
