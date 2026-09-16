import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function PokedexListLoading() {
  return (
    <View
      style={styles.centered}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando Pokédex…"
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.loadingLabel}>Cargando Pokédex…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
