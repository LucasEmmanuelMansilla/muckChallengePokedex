import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { navigateToError } from '../navigation/navigationRef';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Manejo de errores a nivel global.
    onError: () => {
      navigateToError();
    },
  }),
  mutationCache: new MutationCache({
    onError: () => {
      navigateToError();
    },
  }),
});
