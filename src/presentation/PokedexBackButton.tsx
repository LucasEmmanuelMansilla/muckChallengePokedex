import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from './theme';

type PokedexBackButtonProps = {
  onPress: () => void;
};

export function PokedexBackButton({ onPress }: PokedexBackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Volver al listado"
      accessibilityHint="Regresa al listado de la Pokédex"
    >
      {/* El botón ya tiene label; el glifo ‹ no debe leerse como "menor que". */}
      <Text accessible={false} allowFontScaling={false} style={styles.backGlyph}>
        ‹
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    // 44 dp: mínimo táctil de HIG / WCAG. hitSlop suma margen alrededor.
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backGlyph: {
    color: colors.surface,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '300',
  },
});
