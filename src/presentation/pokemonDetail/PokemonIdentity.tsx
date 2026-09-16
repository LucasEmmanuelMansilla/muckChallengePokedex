import { StyleSheet, Text, View } from 'react-native';
import type { PokemonDetail } from '../../domain/Pokemon';
import { IndividualConditionGuard } from '../../../components/IndiviualConditionGuard';
import { PokemonSprite } from '../PokemonSprite';
import { colors, typeColor, typeLabel } from '../theme';

type PokemonIdentityProps = {
  pokemon: PokemonDetail;
  accent: string;
};

export function PokemonIdentity({ pokemon, accent }: PokemonIdentityProps) {
  const rarityLabel = pokemon.isMythical
    ? 'Pokémon singular'
    : pokemon.isLegendary
    ? 'Pokémon legendario'
    : null;

  return (
    <>
      <View style={[styles.spriteWell, { backgroundColor: `${accent}24` }]}>
        <PokemonSprite uri={pokemon.imageUrl} size={148} />
      </View>

      <IndividualConditionGuard
        condition={!!rarityLabel}
        children={
          <View style={styles.rarity}>
            <Text style={styles.rarityLabel}>{rarityLabel}</Text>
          </View>
        }
      />

      <View style={styles.types}>
        {pokemon.types.map(type => (
          <View
            key={type}
            accessible
            accessibilityLabel={`Tipo ${typeLabel(type)}`}
            style={[styles.chip, { backgroundColor: typeColor(type) }]}
          >
            <Text style={styles.chipLabel}>{typeLabel(type)}</Text>
          </View>
        ))}
      </View>

      <IndividualConditionGuard
        condition={!!pokemon.genus}
        children={<Text style={styles.genus}>{pokemon.genus}</Text>}
      />

      <IndividualConditionGuard
        condition={!!pokemon.description}
        children={<Text style={styles.description}>{pokemon.description}</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  spriteWell: {
    alignSelf: 'center',
    width: 168,
    height: 168,
    borderRadius: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rarity: {
    alignSelf: 'center',
    backgroundColor: colors.errorSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  rarityLabel: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipLabel: {
    color: colors.chipText,
    fontSize: 12,
    fontWeight: '700',
  },
  genus: {
    marginTop: 14,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    marginTop: 10,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
