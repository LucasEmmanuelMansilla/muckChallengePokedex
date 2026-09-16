import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PokeBall } from './PokeBall';
import { colors } from './theme';

type PokedexStatusProps = {
  title: string;
  message: string;
  actionLabel: string;
  actionHint?: string;
  onAction: () => void;
  fill?: boolean;
};

export function PokedexStatus({
  title,
  message,
  actionLabel,
  actionHint = 'Vuelve a intentar la carga',
  onAction,
  fill = false,
}: PokedexStatusProps) {
  return (
    <View style={fill ? styles.fill : styles.inline}>
      <View style={styles.badge}>
        <PokeBall size={88} />
      </View>
      <View accessibilityRole="alert" accessibilityLiveRegion="assertive">
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <Pressable
        onPress={onAction}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        accessibilityRole="button"
        accessibilityHint={actionHint}
      >
        <Text style={styles.buttonLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
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
    minHeight: 44,
    paddingHorizontal: 28,
    paddingVertical: 14,
    justifyContent: 'center',
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
