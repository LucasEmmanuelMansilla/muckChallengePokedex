import { StyleSheet, Text, View } from 'react-native';
import { eggGroupLabel } from '../formatPokemon';
import { colors } from '../theme';
import { DetailSection } from './DetailSection';

type PokemonEggGroupsProps = {
  eggGroups: string[];
};

export function PokemonEggGroups({ eggGroups }: PokemonEggGroupsProps) {
  if (eggGroups.length === 0) {
    return null;
  }

  return (
    <DetailSection title="Grupos huevo">
      <View style={styles.types}>
        {eggGroups.map(group => (
          <View key={group} style={styles.softChip}>
            <Text style={styles.softChipLabel}>{eggGroupLabel(group)}</Text>
          </View>
        ))}
      </View>
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  softChip: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  softChipLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
});
