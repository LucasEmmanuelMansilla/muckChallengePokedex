import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/presentation/theme';

function App() {
  return (
    <NavigationProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <RootNavigator />
      </View>
    </NavigationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
