import { StyleSheet, View } from 'react-native';
import ErrorScreen from '../presentation/screens/ErrorScreen';
import HomeScreen from '../presentation/screens/HomeScreen';
import PokemonDetailScreen from '../presentation/screens/PokemonDetailScreen';
import { useNavigation, type RootRoute } from './NavigationContext';

/**
 * Cada ruta queda montada con `display: none` en vez de desmontar.
 * Volver de la ficha no re-pide las 20 cards ni pierde la posición del
 * FlatList. pointerEvents/a11y ocultan las pantallas de atrás al lector.
 */
export function RootNavigator() {
  const { stack } = useNavigation();
  const activeIndex = stack.length - 1;

  return (
    <View style={styles.root}>
      {stack.map((route, index) => (
        <View
          key={screenKey(route, index)}
          style={index === activeIndex ? styles.active : styles.hidden}
          pointerEvents={index === activeIndex ? 'auto' : 'none'}
          accessibilityElementsHidden={index !== activeIndex}
          importantForAccessibility={
            index === activeIndex ? 'auto' : 'no-hide-descendants'
          }
        >
          {renderRoute(route)}
        </View>
      ))}
    </View>
  );
}

function renderRoute(route: RootRoute) {
  switch (route.name) {
    case 'Home':
      return <HomeScreen />;
    case 'PokemonDetail':
      return <PokemonDetailScreen pokemonId={route.pokemonId} />;
    case 'Error':
      return <ErrorScreen />;
  }
}

function screenKey(route: RootRoute, index: number) {
  switch (route.name) {
    case 'Home':
      return `home-${index}`;
    case 'PokemonDetail':
      return `detail-${route.pokemonId}-${index}`;
    case 'Error':
      return `error-${index}`;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  active: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
