import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '../src/navigation/NavigationContext';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { PokedexStatus } from '../src/presentation/PokedexStatus';
import { colors } from '../src/presentation/theme';

export default function ErrorScreen() {
  const { retry } = useNavigation();

  return (
    <PokedexScreen
      header={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.headerTitle}>
            Pokédex
          </Text>
        </View>
      }
    >
      <PokedexStatus
        fill
        title="¡La Pokebola se abrió mal!"
        message="No pudimos cargar los Pokemones. Revisá tu conexión e intentá de nuevo."
        actionLabel="Reintentar captura"
        onAction={retry}
      />
    </PokedexScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
  },
});
