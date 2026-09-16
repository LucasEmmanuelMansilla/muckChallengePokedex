import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConditionGuard } from '../components/ConditionGuard';
import { useNavigation } from '../src/navigation/NavigationContext';
import { PokeBall } from '../src/presentation/PokeBall';
import { PokemonCard } from '../src/presentation/PokemonCard';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { colors } from '../src/presentation/theme';
import { usePokemonList } from '../src/presentation/usePokemonList';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { pokemon, isLoading } = usePokemonList();

  return (
    <PokedexScreen header={<HomeHeader />}>
      <ConditionGuard
        when={isLoading}
        component={
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingLabel}>Cargando Pokédex…</Text>
          </View>
        }>
        <FlatList
          data={pokemon}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={ListSeparator}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() =>
                navigation.navigate({
                  name: 'PokemonDetail',
                  pokemonId: item.id,
                })
              }
            />
          )}
        />
      </ConditionGuard>
    </PokedexScreen>
  );
}

function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <PokeBall size={36} />
        <View>
          <Text style={styles.title}>Pokédex</Text>
        </View>
      </View>
    </View>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
});
