import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Error: undefined;
  PokemonDetail: { pokemonId: number };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToError() {
  if (!navigationRef.isReady()) {
    return;
  }

  // Manejo de errores a nivel global.
  if (navigationRef.getCurrentRoute()?.name === 'Error') {
    return;
  }

  navigationRef.navigate('Error');
}
