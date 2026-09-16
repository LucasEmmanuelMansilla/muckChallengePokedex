import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '../src/navigation/NavigationContext';
import { PokeBall } from '../src/presentation/PokeBall';
import { PokedexScreen } from '../src/presentation/PokedexScreen';
import { colors } from '../src/presentation/theme';

export default function ErrorScreen() {
  const { retry } = useNavigation();

  return (
    <PokedexScreen
      header={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pokédex</Text>
        </View>
      }>
      <View style={styles.body}>
        <View style={styles.badge}>
          <PokeBall size={88} />
        </View>
        <Text style={styles.title}>¡La Pokebola se abrió mal!</Text>
        <Text style={styles.message}>
          No pudimos cargar los Pokemones. Revisá tu conexión e intentá de
          nuevo.
        </Text>
        <Pressable
          onPress={retry}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Reintentar">
          <Text style={styles.buttonLabel}>Reintentar captura</Text>
        </Pressable>
      </View>
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  badge: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.errorRing,
  },
  title: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
});
