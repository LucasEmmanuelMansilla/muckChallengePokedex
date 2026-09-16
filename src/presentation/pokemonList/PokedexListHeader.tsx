import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PokeBall } from '../PokeBall';
import { colors } from '../theme';

export const PokedexListHeader = memo(function PokedexListHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <PokeBall size={36} />
        <View>
          <Text accessibilityRole="header" style={styles.title}>
            Pokédex
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
