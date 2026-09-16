import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ReloadValue = {
  reloadCount: number;
  bumpReload: () => void;
};

const ReloadContext = createContext<ReloadValue | null>(null);

export function ReloadProvider({ children }: { children: ReactNode }) {
  const [reloadCount, setReloadCount] = useState(0);
  const bumpReload = useCallback(() => {
    setReloadCount(count => count + 1);
  }, []);

  const value = useMemo(
    () => ({ reloadCount, bumpReload }),
    [reloadCount, bumpReload],
  );

  return (
    <ReloadContext.Provider value={value}>{children}</ReloadContext.Provider>
  );
}

export function useReloadSignal() {
  const value = useContext(ReloadContext);
  if (value === null) {
    throw new Error('useReloadSignal requiere ReloadProvider');
  }
  return value;
}
