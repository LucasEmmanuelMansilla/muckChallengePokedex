import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';

type PokedexHeaderProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
};

export function PokedexHeader({
  title,
  subtitle,
  leading,
}: PokedexHeaderProps) {
  return (
    <View style={styles.header}>
      {leading}
      <View style={styles.copy}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text
          accessibilityRole="header"
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },
  copy: {
    flex: 1,
  },
  subtitle: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
