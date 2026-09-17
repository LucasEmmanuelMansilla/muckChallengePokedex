import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { BackHandler } from 'react-native';
import type { AppError } from '../domain/AppError';
import { ReloadProvider, useReloadSignal } from './ReloadContext';

/**
 * Stack en memoria en lugar de React Navigation: el challenge restringe
 * libs y con 3 rutas no hace falta deep linking. Las pantallas previas
 * siguen montadas (ver RootNavigator) para no perder scroll ni refetch.
 */
export type RootRoute =
  | { name: 'Home' }
  | { name: 'PokemonDetail'; pokemonId: number }
  | { name: 'Error' };

export type LoadFailure = {
  source: 'list' | 'detail';
  error: AppError;
};

type NavigationValue = {
  stack: RootRoute[];
  failure: LoadFailure | null;
  navigate: (route: RootRoute) => void;
  goBack: () => void;
  navigateToError: (failure: LoadFailure) => void;
  retry: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  return (
    <ReloadProvider>
      <NavigationController>{children}</NavigationController>
    </ReloadProvider>
  );
}

function NavigationController({ children }: { children: ReactNode }) {
  const { bumpReload } = useReloadSignal();
  const [stack, setStack] = useState<RootRoute[]>([{ name: 'Home' }]);
  const [failure, setFailure] = useState<LoadFailure | null>(null);
  // El listener de BackHandler se registra una vez; el ref evita una
  // closure con el stack viejo sin re-suscribir en cada navegación.
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const navigate = useCallback((route: RootRoute) => {
    setStack(current => [...current, route]);
  }, []);

  const goBack = useCallback(() => {
    setStack(current => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const navigateToError = useCallback((nextFailure: LoadFailure) => {
    setFailure(nextFailure);
    // Un segundo fallo no apila otra Error: actualiza el copy y listo.
    setStack(current =>
      current[current.length - 1]?.name === 'Error'
        ? current
        : [...current, { name: 'Error' }],
    );
  }, []);

  const retry = useCallback(() => {
    // Error queda encima de Home/ficha: pop + bumpReload reintenta sin
    // desmontar el listado (evita re-pedir las 20 cards).
    bumpReload();
    setFailure(null);
    setStack(current =>
      current.length > 1 ? current.slice(0, -1) : [{ name: 'Home' }],
    );
  }, [bumpReload]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const current = stackRef.current[stackRef.current.length - 1];
        if (current?.name === 'Error') {
          retry();
          return true;
        }

        if (stackRef.current.length > 1) {
          goBack();
          return true;
        }

        // false = el sistema sale de la app (estamos en Home).
        return false;
      },
    );

    return () => subscription.remove();
  }, [goBack, retry]);

  const value = useMemo<NavigationValue>(
    () => ({
      stack,
      failure,
      navigate,
      goBack,
      navigateToError,
      retry,
    }),
    [stack, failure, navigate, goBack, navigateToError, retry],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const value = useContext(NavigationContext);
  if (value === null) {
    throw new Error('useNavigation requiere NavigationProvider');
  }
  return value;
}
