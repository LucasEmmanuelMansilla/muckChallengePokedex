import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '../../navigation/NavigationContext';
import { ConditionGuard } from '../ConditionGuard';
import { PokedexBackButton } from '../PokedexBackButton';
import { PokedexHeader } from '../PokedexHeader';
import { PokedexScreen } from '../PokedexScreen';
import { PokemonDetailView } from '../pokemonDetail/PokemonDetailView';
import { colors } from '../theme';
import { usePokemonDetail } from '../usePokemonDetail';

type PokemonDetailScreenProps = {
  pokemonId: number;
};

export default function PokemonDetailScreen({
  pokemonId,
}: PokemonDetailScreenProps) {
  const { goBack } = useNavigation();
  const { pokemon, isLoading } = usePokemonDetail(pokemonId);

  return (
    <ConditionGuard
      when={isLoading || !pokemon}
      component={
        <PokedexScreen
          header={
            <PokedexHeader
              title="Pokémon"
              leading={<PokedexBackButton onPress={goBack} />}
            />
          }
        >
          <View
            style={styles.loadingBody}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Cargando ficha…"
            accessibilityLiveRegion="polite"
          >
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingLabel}>Cargando ficha…</Text>
          </View>
        </PokedexScreen>
      }
    >
      <PokemonDetailView pokemon={pokemon!} onBack={goBack} />
    </ConditionGuard>
  );
}

const styles = StyleSheet.create({
  loadingBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
});
