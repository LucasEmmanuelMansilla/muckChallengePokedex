import { Image, StyleSheet, Text, View } from 'react-native';
import type { Pokemon } from '../domain/Pokemon';
import { colors, typeColor, typeLabel } from './theme';

type PokemonCardProps = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const accent = typeColor(pokemon.types[0] ?? 'normal');

  return (
    <View style={styles.shadow}>
      <View style={styles.card}>
        <View style={[styles.accent, { backgroundColor: accent }]} />
        <View style={styles.body}>
          <View style={styles.copy}>
            <Text style={styles.number}>{formatPokedexNumber(pokemon.id)}</Text>
            <Text style={styles.name}>{formatPokemonName(pokemon.name)}</Text>
            <View style={styles.types}>
              {pokemon.types.map(type => (
                <View
                  key={type}
                  style={[styles.chip, { backgroundColor: typeColor(type) }]}>
                  <Text style={styles.chipLabel}>{typeLabel(type)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.metrics}>
              <Text style={styles.metric}>
                {formatMetric(pokemon.heightMeters, 'm')}
              </Text>
              <View style={styles.dot} />
              <Text style={styles.metric}>
                {formatMetric(pokemon.weightKilograms, 'kg')}
              </Text>
            </View>
          </View>
          <View style={[styles.spriteWell, { backgroundColor: `${accent}24` }]}>
            <Image
              source={{ uri: pokemon.imageUrl }}
              style={styles.sprite}
              accessibilityLabel={formatPokemonName(pokemon.name)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatPokedexNumber(id: number): string {
  return `N.º ${String(id).padStart(4, '0')}`;
}

function formatMetric(value: number, unit: string): string {
  return `${value.toLocaleString('es-AR', {
    maximumFractionDigits: 1,
  })} ${unit}`;
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  accent: {
    width: 7,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  number: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  name: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipLabel: {
    color: colors.chipText,
    fontSize: 11,
    fontWeight: '700',
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metric: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  spriteWell: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 88,
    height: 88,
  },
});
