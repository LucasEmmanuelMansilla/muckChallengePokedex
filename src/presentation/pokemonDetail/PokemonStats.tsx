import { StyleSheet, Text, View } from 'react-native';
import type { PokemonStat } from '../../domain/Pokemon';
import { statLabel } from '../formatPokemon';
import { colors } from '../theme';
import { DetailSection } from './DetailSection';

const STAT_MAX = 255;

type PokemonStatsProps = {
  stats: PokemonStat[];
  accent: string;
};

export function PokemonStats({ stats, accent }: PokemonStatsProps) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <DetailSection title="Estadísticas base">
      <View style={styles.statList}>
        {stats.map(stat => (
          <StatRow
            key={stat.name}
            label={statLabel(stat.name)}
            value={stat.value}
            color={accent}
          />
        ))}
      </View>
    </DetailSection>
  );
}

// Componente local que no se reutiliza en otro lugar
function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const ratio = Math.min(value / STAT_MAX, 1);

  return (
    <View
      style={styles.statRow}
      accessible
      accessibilityLabel={`${label}, ${value}`}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statTrack}>
        <View
          style={[
            styles.statFill,
            { width: `${ratio * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    width: 86,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  statValue: {
    width: 32,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  statTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 999,
  },
});
