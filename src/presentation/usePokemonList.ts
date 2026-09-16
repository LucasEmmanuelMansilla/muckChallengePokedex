import { useCallback, useEffect, useRef, useState } from 'react';
import { listPokemon } from '../di/container';
import type { Pokemon } from '../domain/Pokemon';
import { useNavigation } from '../navigation/NavigationContext';

export function usePokemonList() {
  const { navigateToError, retryCount } = useNavigation();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const pokemonRef = useRef(pokemon);
  pokemonRef.current = pokemon;

  const loadFirstPage = useCallback(
    (requestId: number) => {
      loadingMoreRef.current = false;
      setLoadMoreFailed(false);
      setIsLoading(true);
      setIsLoadingMore(false);
      setHasMore(true);

      listPokemon
        .execute(0)
        .then(page => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setPokemon(page.items);
          setHasMore(page.hasMore);
          setIsLoading(false);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setIsLoading(false);
          navigateToError();
        });
    },
    [navigateToError],
  );

  useEffect(() => {
    // retryCount es global: un error de ficha no debe vaciar el listado
    // ya en memoria (re-render de 20+ cards y 21 requests).
    if (pokemonRef.current.length > 0) {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
      return;
    }

    loadFirstPage(++requestIdRef.current);
  }, [loadFirstPage, retryCount]);

  const reload = useCallback(() => {
    loadFirstPage(++requestIdRef.current);
  }, [loadFirstPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || loadingMoreRef.current) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadMoreFailed(false);
    setIsLoadingMore(true);
    const requestId = requestIdRef.current;
    const offset = pokemon.length;

    listPokemon
      .execute(offset)
      .then(page => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setPokemon(current => appendUnique(current, page.items));
        setHasMore(page.hasMore);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setLoadMoreFailed(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      });
  }, [hasMore, isLoading, pokemon.length]);

  return {
    pokemon,
    isLoading,
    isLoadingMore,
    loadMoreFailed,
    loadMore,
    reload,
  };
}

function appendUnique(current: Pokemon[], incoming: Pokemon[]): Pokemon[] {
  if (incoming.length === 0) {
    return current;
  }

  const seen = new Set(current.map(item => item.id));
  const extra = incoming.filter(item => !seen.has(item.id));
  return extra.length === 0 ? current : [...current, ...extra];
}
