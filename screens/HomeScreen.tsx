import { memo, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { ConditionGuard } from '../components/ConditionGuard';
import type { Pokemon } from '../src/domain/Pokemon';
import { useNavigation } from '../src/navigation/NavigationContext';
import { PokeBall } from '../src/presentation/PokeBall';
import { PokemonCard } from '../src/presentation/PokemonCard';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { colors } from '../src/presentation/theme';
import { usePokemonList } from '../src/presentation/usePokemonList';

export default function HomeScreen() {
  const { navigate } = useNavigation();
  const { pokemon, isLoading, isLoadingMore, loadMore } = usePokemonList();

  const handlePress = useCallback(
    (pokemonId: number) => {
      navigate({
        name: 'PokemonDetail',
        pokemonId,
      });
    },
    [navigate],
  );

  const renderItem = useCallback<ListRenderItem<Pokemon>>(
    ({ item }) => <PokemonCard pokemon={item} onPress={handlePress} />,
    [handlePress],
  );

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
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={ListSeparator}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={isLoadingMore ? ListLoadingMore : undefined}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
        />
      </ConditionGuard>
    </PokedexScreen>
  );
}

const HomeHeader = memo(function HomeHeader() {
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
});

function ListSeparator() {
  return <View style={styles.separator} />;
}

function ListLoadingMore() {
  return (
    <View style={styles.footer} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.loadingLabel}>Cargando más Pokémon…</Text>
    </View>
  );
}

function keyExtractor(item: Pokemon) {
  return String(item.id);
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
  footer: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
    gap: 8,
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
