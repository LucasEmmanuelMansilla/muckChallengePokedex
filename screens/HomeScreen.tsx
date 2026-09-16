import { useCallback } from 'react';
import { ConditionGuard } from '../components/ConditionGuard';
import { useNavigation } from '../src/navigation/NavigationContext';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { PokedexListHeader } from '../src/presentation/pokemonList/PokedexListHeader';
import { PokedexListLoading } from '../src/presentation/pokemonList/PokedexListLoading';
import { PokemonList } from '../src/presentation/pokemonList/PokemonList';
import { usePokemonList } from '../src/presentation/usePokemonList';

export default function HomeScreen() {
  const { navigate } = useNavigation();
  const {
    pokemon,
    isLoading,
    isLoadingMore,
    loadMoreFailed,
    loadMore,
    reload,
  } = usePokemonList();

  const handlePress = useCallback(
    (pokemonId: number) => {
      navigate({
        name: 'PokemonDetail',
        pokemonId,
      });
    },
    [navigate],
  );

  return (
    <PokedexScreen header={<PokedexListHeader />}>
      <ConditionGuard when={isLoading} component={<PokedexListLoading />}>
        <PokemonList
          pokemon={pokemon}
          isLoadingMore={isLoadingMore}
          loadMoreFailed={loadMoreFailed}
          onPokemonPress={handlePress}
          onLoadMore={loadMore}
          onReload={reload}
        />
      </ConditionGuard>
    </PokedexScreen>
  );
}
