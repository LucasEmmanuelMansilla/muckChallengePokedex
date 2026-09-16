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
    setStack(current =>
      current[current.length - 1]?.name === 'Error'
        ? current
        : [...current, { name: 'Error' }],
    );
  }, []);

  const retry = useCallback(() => {
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
