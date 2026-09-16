import { useEffect, useRef, useState } from 'react';
import { toAppError } from '../domain/AppError';
import { useNavigation } from '../navigation/NavigationContext';
import { useReloadSignal } from '../navigation/ReloadContext';

export function useRemoteData<T>(
  load: () => Promise<T>,
  resourceKey: string | number,
  source: 'list' | 'detail' = 'detail',
) {
  const { navigateToError } = useNavigation();
  const { reloadCount } = useReloadSignal();
  const loadRef = useRef(load);
  loadRef.current = load;
  const dataRef = useRef<T | undefined>(undefined);

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (dataRef.current === undefined) {
      setIsLoading(true);
    }

    loadRef
      .current()
      .then(result => {
        if (cancelled) {
          return;
        }
        dataRef.current = result;
        setData(result);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        setIsLoading(false);
        navigateToError({ source, error: toAppError(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [navigateToError, resourceKey, reloadCount, source]);

  return { data, isLoading };
}
