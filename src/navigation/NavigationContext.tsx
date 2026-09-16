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

export type RootRoute =
  | { name: 'Home' }
  | { name: 'PokemonDetail'; pokemonId: number }
  | { name: 'Error' };

type NavigationValue = {
  stack: RootRoute[];
  retryCount: number;
  navigate: (route: RootRoute) => void;
  goBack: () => void;
  navigateToError: () => void;
  retry: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<RootRoute[]>([{ name: 'Home' }]);
  // Al reintentar, las pantallas que siguen montadas vuelven a pedir datos.
  const [retryCount, setRetryCount] = useState(0);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const navigate = useCallback((route: RootRoute) => {
    setStack(current => [...current, route]);
  }, []);

  const goBack = useCallback(() => {
    setStack(current => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const navigateToError = useCallback(() => {
    setStack(current =>
      current[current.length - 1]?.name === 'Error'
        ? current
        : [...current, { name: 'Error' }],
    );
  }, []);

  const retry = useCallback(() => {
    setRetryCount(count => count + 1);
    setStack(current =>
      current.length > 1 ? current.slice(0, -1) : [{ name: 'Home' }],
    );
  }, []);

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
      retryCount,
      navigate,
      goBack,
      navigateToError,
      retry,
    }),
    [stack, retryCount, navigate, goBack, navigateToError, retry],
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
