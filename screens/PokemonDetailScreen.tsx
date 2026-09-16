import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConditionGuard } from '../components/ConditionGuard';
import type { RootStackParamList } from '../src/navigation/navigationRef';
import { PokemonDetailView } from '../src/presentation/pokemonDetail/PokemonDetailView';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { colors } from '../src/presentation/theme';
import { usePokemonDetail } from '../src/presentation/usePokemonDetail';

type PokemonDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PokemonDetail'
>;

export default function PokemonDetailScreen({
  navigation,
  route,
}: PokemonDetailScreenProps) {
  const { pokemonId } = route.params;
  const { pokemon, isLoading } = usePokemonDetail(pokemonId);

  return (
    <ConditionGuard
      when={isLoading || !pokemon}
      component={
        <PokedexScreen
          header={
            <View style={styles.header}>
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Volver al listado">
                <Text style={styles.backGlyph}>‹</Text>
              </Pressable>
              <Text style={styles.headerTitle}>Pokémon</Text>
            </View>
          }>
          <View style={styles.loadingBody}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingLabel}>Cargando ficha…</Text>
          </View>
        </PokedexScreen>
      }>
      <PokemonDetailView
        pokemon={pokemon!}
        onBack={() => navigation.goBack()}
      />
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
    width: 40,
    height: 40,
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
