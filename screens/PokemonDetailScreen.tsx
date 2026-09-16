import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConditionGuard } from '../components/ConditionGuard';
import { useNavigation } from '../src/navigation/NavigationContext';
import { PokemonDetailView } from '../src/presentation/pokemonDetail/PokemonDetailView';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { colors } from '../src/presentation/theme';
import { usePokemonDetail } from '../src/presentation/usePokemonDetail';

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
            <View style={styles.header}>
              <Pressable
                onPress={goBack}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Volver al listado"
              >
                <Text
                  accessible={false}
                  allowFontScaling={false}
                  style={styles.backGlyph}
                >
                  ‹
                </Text>
              </Pressable>
              <Text accessibilityRole="header" style={styles.headerTitle}>
                Pokémon
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backGlyph: {
    color: colors.surface,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '300',
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
  },
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
