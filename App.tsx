import { StatusBar, StyleSheet, View } from 'react-native';
import { getPokemon, listPokemon } from './src/di/container';
import { PokemonUseCasesProvider } from './src/di/PokemonUseCasesContext';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppErrorBoundary } from './src/presentation/AppErrorBoundary';
import { colors } from './src/presentation/theme';

function App() {
  return (
    <PokemonUseCasesProvider listPokemon={listPokemon} getPokemon={getPokemon}>
      <NavigationProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          {/* Dentro del navigator para que Reintentar no resetee el stack. */}
          <AppErrorBoundary>
            <RootNavigator />
          </AppErrorBoundary>
        </View>
      </NavigationProvider>
    </PokemonUseCasesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
