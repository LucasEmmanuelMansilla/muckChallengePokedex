import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '../navigation/NavigationContext';

export function useRemoteData<T>(
  load: () => Promise<T>,
  resourceKey: string | number,
) {
  const { navigateToError, retryCount } = useNavigation();
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
      .catch(() => {
        if (cancelled) {
          return;
        }
        setIsLoading(false);
        navigateToError();
      });

    return () => {
      cancelled = true;
    };
  }, [navigateToError, resourceKey, retryCount]);

  return { data, isLoading };
}
