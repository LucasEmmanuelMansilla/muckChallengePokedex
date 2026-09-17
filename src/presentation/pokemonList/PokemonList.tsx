import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import type { Pokemon } from '../../domain/Pokemon';
import { PokedexStatus } from '../PokedexStatus';
import { PokemonCard } from '../PokemonCard';
import { PokemonListFooter } from './PokemonListFooter';

type PokemonListProps = {
  pokemon: Pokemon[];
  isLoadingMore: boolean;
  loadMoreFailed: boolean;
  onPokemonPress: (pokemonId: number) => void;
  onLoadMore: () => void;
  onReload: () => void;
};

export function PokemonList({
  pokemon,
  isLoadingMore,
  loadMoreFailed,
  onPokemonPress,
  onLoadMore,
  onReload,
}: PokemonListProps) {
  const renderItem = useCallback<ListRenderItem<Pokemon>>(
    ({ item }) => (
      <View style={styles.listItem}>
        <PokemonCard pokemon={item} onPress={onPokemonPress} />
      </View>
    ),
    [onPokemonPress],
  );

  return (
    <FlatList
      data={pokemon}
      keyExtractor={keyExtractor}
      contentContainerStyle={[
        styles.list,
        pokemon.length === 0 ? styles.listFill : null,
      ]}
      renderItem={renderItem}
      // Si falló "cargar más", no seguir pidiendo al llegar al fondo.
      onEndReached={loadMoreFailed ? undefined : onLoadMore}
      onEndReachedThreshold={0.2}
      ListEmptyComponent={
        <PokedexStatus
          title="No se encontraron Pokemones"
          message="La Pokédex respondió, pero no trajo Pokémon para mostrar."
          actionLabel="Volver a buscar"
          onAction={onReload}
        />
      }
      ListFooterComponent={
        isLoadingMore || loadMoreFailed ? (
          <PokemonListFooter
            isLoadingMore={isLoadingMore}
            loadMoreFailed={loadMoreFailed}
            onRetry={onLoadMore}
          />
        ) : undefined
      }
      // Ventana chica a propósito: 20+ cards con sprites remotas en Android
      // de gama baja. Los defaults de FlatList dejan demasiadas celdas vivas.
      initialNumToRender={10}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews
    />
  );
}

function keyExtractor(item: Pokemon) {
  return String(item.id);
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  listFill: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listItem: {
    marginBottom: 12,
  },
});
