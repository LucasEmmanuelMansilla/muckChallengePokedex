import { StyleSheet, Text, View } from 'react-native';
import type { PokemonDetail } from '../../domain/Pokemon';
import {
  formatGender,
  formatMetric,
  generationLabel,
  growthRateLabel,
  habitatLabel,
} from '../formatPokemon';
import { colors } from '../theme';
import { DetailSection } from './DetailSection';

type PokemonFactsProps = {
  pokemon: PokemonDetail;
};

export function PokemonFacts({ pokemon }: PokemonFactsProps) {
  return (
    <DetailSection title="Datos">
      <View style={styles.grid}>
        <Fact label="Altura" value={formatMetric(pokemon.heightMeters, 'm')} />
        <Fact
          label="Peso"
          value={formatMetric(pokemon.weightKilograms, 'kg')}
        />
        <Fact
          label="Hábitat"
          value={pokemon.habitat ? habitatLabel(pokemon.habitat) : 'Desconocido'}
        />
        <Fact label="Ratio de captura" value={String(pokemon.captureRate)} />
        <Fact label="Género" value={formatGender(pokemon.genderRate)} />
        <Fact label="Generación" value={generationLabel(pokemon.generation)} />
        <Fact label="Crecimiento" value={growthRateLabel(pokemon.growthRate)} />
        {pokemon.baseExperience != null ? (
          <Fact label="Exp. base" value={String(pokemon.baseExperience)} />
        ) : null}
      </View>
    </DetailSection>
  );
}

// Se queda en este archivo: es layout de esta grilla, no un átomo de UI.
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fact: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  factLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  factValue: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
});
