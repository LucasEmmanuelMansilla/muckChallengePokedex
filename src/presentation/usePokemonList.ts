import { useCallback, useEffect, useRef, useState } from 'react';
import { usePokemonUseCases } from '../di/PokemonUseCasesContext';
import { toAppError } from '../domain/AppError';
import type { Pokemon } from '../domain/Pokemon';
import { useNavigation } from '../navigation/NavigationContext';
import { useReloadSignal } from '../navigation/ReloadContext';

/**
 * Paginación aparte de `useRemoteData`: un fallo de "cargar más" no debe
 * cubrir el listado con ErrorScreen (el usuario ya ve 20+ cards).
 */
export function usePokemonList() {
  const { listPokemon } = usePokemonUseCases();
  const { navigateToError } = useNavigation();
  const { reloadCount } = useReloadSignal();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // Distingue respuestas de un reload anterior (Strict Mode / retry rápido).
  const requestIdRef = useRef(0);
  // FlatList puede disparar onEndReached dos veces; el ref corta el segundo
  // fetch antes de que React reciba el setState de isLoadingMore.
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
        .catch((error: unknown) => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setIsLoading(false);
          navigateToError({ source: 'list', error: toAppError(error) });
        });
    },
    [listPokemon, navigateToError],
  );

  useEffect(() => {
    // reloadCount es global: un error de ficha no debe vaciar el listado
    // ya en memoria (re-render de 20+ cards y 21 requests).
    if (pokemonRef.current.length > 0) {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
      return;
    }

    loadFirstPage(++requestIdRef.current);
  }, [loadFirstPage, reloadCount]);

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

        // El listado sigue visible; solo el footer ofrece reintentar.
        setLoadMoreFailed(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      });
  }, [hasMore, isLoading, listPokemon, pokemon.length]);

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

  // Un retry de página o un overlap de offset no debe duplicar cards.
  const seen = new Set(current.map(item => item.id));
  const extra = incoming.filter(item => !seen.has(item.id));
  return extra.length === 0 ? current : [...current, ...extra];
}
