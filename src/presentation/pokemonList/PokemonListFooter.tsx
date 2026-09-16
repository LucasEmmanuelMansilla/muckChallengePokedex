import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type PokemonListFooterProps = {
  isLoadingMore: boolean;
  loadMoreFailed: boolean;
  onRetry: () => void;
};

export function PokemonListFooter({
  isLoadingMore,
  loadMoreFailed,
  onRetry,
}: PokemonListFooterProps) {
  if (isLoadingMore) {
    return <ListLoadingMore />;
  }

  if (loadMoreFailed) {
    return <ListLoadMoreError onRetry={onRetry} />;
  }

  return null;
}

function ListLoadingMore() {
  return (
    <View
      style={styles.footer}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando más Pokemones…"
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.loadingLabel}>Cargando más Pokémon…</Text>
    </View>
  );
}

function ListLoadMoreError({ onRetry }: { onRetry: () => void }) {
  return (
    <View
      style={styles.footer}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Text style={styles.loadingLabel}>No se pudieron cargar más Pokemones.</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Reintentar carga"
      >
        <Text style={styles.retryLabel}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
    gap: 8,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  retryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  retryLabel: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  loadingLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
