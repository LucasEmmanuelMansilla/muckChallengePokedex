import { StyleSheet, Text, View } from 'react-native';
import type { PokemonAbility } from '../../domain/Pokemon';
import { colors } from '../theme';
import { DetailSection } from './DetailSection';

type PokemonAbilitiesProps = {
  abilities: PokemonAbility[];
};

export function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  if (abilities.length === 0) {
    return null;
  }

  return (
    <DetailSection title="Habilidades">
      <View style={styles.abilityList}>
        {abilities.map(ability => (
          <View
            key={`${ability.name}-${ability.isHidden}`}
            style={styles.ability}
            accessible={ability.isHidden}
            accessibilityLabel={
              ability.isHidden ? `${ability.name}, oculta` : undefined
            }
          >
            <Text style={styles.abilityName}>{ability.name}</Text>
            {ability.isHidden ? (
              <Text style={styles.abilityHint}>Oculta</Text>
            ) : null}
          </View>
        ))}
      </View>
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  abilityList: {
    gap: 8,
  },
  ability: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  abilityName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  abilityHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
});
