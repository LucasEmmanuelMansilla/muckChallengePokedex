import type { HttpClient } from '../../src/domain/HttpClient';

type PokemonSeed = {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number | null;
  types: Array<{ slot: number; name: string }>;
  abilities: Array<{ slot: number; name: string; hidden: boolean }>;
  stats: Array<{ name: string; value: number }>;
  species: {
    flavorText: Array<{ language: string; text: string }>;
    genera: Array<{ language: string; genus: string }>;
    captureRate: number;
    habitat: string | null;
    genderRate: number;
    eggGroups: string[];
    isLegendary: boolean;
    isMythical: boolean;
    generation: string;
    growthRate: string;
  };
  abilityNames: Record<string, Array<{ language: string; name: string }>>;
};

export const bulbasaurApi: PokemonSeed = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  baseExperience: 64,
  types: [
    { slot: 2, name: 'poison' },
    { slot: 1, name: 'grass' },
  ],
  abilities: [
    { slot: 3, name: 'chlorophyll', hidden: true },
    { slot: 1, name: 'overgrow', hidden: false },
  ],
  stats: [
    { name: 'hp', value: 45 },
    { name: 'attack', value: 49 },
    { name: 'defense', value: 49 },
    { name: 'special-attack', value: 65 },
    { name: 'special-defense', value: 65 },
    { name: 'speed', value: 45 },
  ],
  species: {
    flavorText: [
      {
        language: 'en',
        text: 'A strange seed was planted on its back at birth.',
      },
      {
        language: 'es',
        text: 'Una semilla extraña\nle fue plantada\fen el lomo al nacer.',
      },
    ],
    genera: [
      { language: 'en', genus: 'Seed Pokémon' },
      { language: 'es', genus: 'Pokémon Semilla' },
    ],
    captureRate: 45,
    habitat: 'grassland',
    genderRate: 1,
    eggGroups: ['monster', 'plant'],
    isLegendary: false,
    isMythical: false,
    generation: 'generation-i',
    growthRate: 'medium-slow',
  },
  abilityNames: {
    overgrow: [
      { language: 'en', name: 'Overgrow' },
      { language: 'es', name: 'Espesura' },
    ],
    chlorophyll: [
      { language: 'en', name: 'Chlorophyll' },
      { language: 'es', name: 'Clorofila' },
    ],
  },
};

export function listPayload(pokemon: Array<{ id: number; name: string }>) {
  return {
    results: pokemon.map(item => ({
      name: item.name,
      url: `https://pokeapi.co/api/v2/pokemon/${item.id}/`,
    })),
  };
}

export function pokemonPayload(seed: PokemonSeed) {
  return {
    id: seed.id,
    name: seed.name,
    height: seed.height,
    weight: seed.weight,
    base_experience: seed.baseExperience,
    types: seed.types.map(type => ({
      slot: type.slot,
      type: { name: type.name },
    })),
    abilities: seed.abilities.map(ability => ({
      slot: ability.slot,
      is_hidden: ability.hidden,
      ability: { name: ability.name },
    })),
    stats: seed.stats.map(stat => ({
      base_stat: stat.value,
      stat: { name: stat.name },
    })),
  };
}

export function speciesPayload(seed: PokemonSeed) {
  return {
    flavor_text_entries: seed.species.flavorText.map(entry => ({
      flavor_text: entry.text,
      language: { name: entry.language },
    })),
    genera: seed.species.genera.map(entry => ({
      genus: entry.genus,
      language: { name: entry.language },
    })),
    capture_rate: seed.species.captureRate,
    habitat: seed.species.habitat
      ? { name: seed.species.habitat }
      : null,
    gender_rate: seed.species.genderRate,
    egg_groups: seed.species.eggGroups.map(name => ({ name })),
    is_legendary: seed.species.isLegendary,
    is_mythical: seed.species.isMythical,
    generation: { name: seed.species.generation },
    growth_rate: { name: seed.species.growthRate },
  };
}

export function abilityPayload(
  names: Array<{ language: string; name: string }>,
) {
  return {
    names: names.map(entry => ({
      name: entry.name,
      language: { name: entry.language },
    })),
  };
}

export class RecordingHttpClient implements HttpClient {
  readonly calls: Array<{
    path: string;
    query?: Record<string, string | number>;
  }> = [];
  private readonly responses = new Map<string, unknown>();

  set(
    path: string,
    body: unknown,
    query?: Record<string, string | number>,
  ) {
    this.responses.set(requestKey(path, query), body);
  }

  seed(seed: PokemonSeed) {
    this.set(`/pokemon/${seed.id}`, pokemonPayload(seed));
    this.set(`/pokemon-species/${seed.id}`, speciesPayload(seed));
    for (const [name, names] of Object.entries(seed.abilityNames)) {
      this.set(`/ability/${name}`, abilityPayload(names));
    }
  }

  async get<T>(
    path: string,
    query?: Record<string, string | number>,
  ): Promise<T> {
    this.calls.push({ path, query });
    const key = requestKey(path, query);
    if (!this.responses.has(key)) {
      throw new Error(`HTTP 404 ${key}`);
    }
    return this.responses.get(key) as T;
  }
}

export function stubFetch(routes: Record<string, unknown>, status = 200) {
  globalThis.fetch = jest.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    const key = `${url.pathname}${url.search}`;
    const body = routes[key];

    if (body === undefined) {
      return {
        ok: false,
        status: 404,
        json: async () => ({}),
      };
    }

    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    };
  }) as jest.Mock;
}

export function pokeApiRoutes(seed: PokemonSeed) {
  return {
    [`/api/v2/pokemon?limit=20&offset=0`]: listPayload([seed]),
    [`/api/v2/pokemon/${seed.id}`]: pokemonPayload(seed),
    [`/api/v2/pokemon-species/${seed.id}`]: speciesPayload(seed),
    ...Object.fromEntries(
      Object.entries(seed.abilityNames).map(([name, names]) => [
        `/api/v2/ability/${name}`,
        abilityPayload(names),
      ]),
    ),
  };
}

function requestKey(
  path: string,
  query?: Record<string, string | number>,
) {
  if (!query) {
    return path;
  }

  const params = Object.entries(query)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}=${value}`)
    .join('&');

  return `${path}?${params}`;
}
