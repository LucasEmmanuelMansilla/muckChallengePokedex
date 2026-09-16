import { useCallback } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ConditionGuard } from '../ConditionGuard';
import { FadeIn } from '../FadeIn';
import { PokedexScreen } from '../PokedexScreen';
import { PokedexListHeader } from '../pokemonList/PokedexListHeader';
import { PokedexListLoading } from '../pokemonList/PokedexListLoading';
import { PokemonList } from '../pokemonList/PokemonList';
import { usePokemonList } from '../usePokemonList';

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
        <FadeIn>
          <PokemonList
            pokemon={pokemon}
            isLoadingMore={isLoadingMore}
            loadMoreFailed={loadMoreFailed}
            onPokemonPress={handlePress}
            onLoadMore={loadMore}
            onReload={reload}
          />
        </FadeIn>
      </ConditionGuard>
    </PokedexScreen>
  );
}
