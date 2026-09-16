import { StyleSheet, View } from 'react-native';
import { colors } from './theme';

type PokeBallProps = {
  size?: number;
};

export function PokeBall({ size = 64 }: PokeBallProps) {
  const border = Math.max(2, size * 0.06);
  const band = Math.max(3, size * 0.08);
  const button = size * 0.3;
  const buttonInner = size * 0.14;

  return (
    <View
      accessibilityLabel="Pokéball"
      style={[
        styles.shell,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: border,
        },
      ]}>
      <View style={styles.top} />
      <View style={styles.bottom} />
      <View style={[styles.band, { height: band, marginTop: -band / 2 }]} />
      <View
        style={[
          styles.button,
          {
            width: button,
            height: button,
            borderRadius: button / 2,
            borderWidth: border,
            marginLeft: -button / 2,
            marginTop: -button / 2,
          },
        ]}>
        <View
          style={{
            width: buttonInner,
            height: buttonInner,
            borderRadius: buttonInner / 2,
            backgroundColor: colors.line,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderColor: colors.ink,
    backgroundColor: colors.surface,
  },
  top: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  bottom: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  band: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    backgroundColor: colors.ink,
  },
  button: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
