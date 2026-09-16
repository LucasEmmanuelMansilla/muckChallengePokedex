import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPokedexNumber, formatPokemonName } from '../formatPokemon';
import { colors } from '../theme';

type PokemonDetailHeaderProps = {
  id: number;
  name: string;
  onBack: () => void;
};

export function PokemonDetailHeader({
  id,
  name,
  onBack,
}: PokemonDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Volver al listado"
      >
        <Text
          accessible={false}
          allowFontScaling={false}
          style={styles.backGlyph}
        >
          ‹
        </Text>
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={styles.headerNumber}>{formatPokedexNumber(id)}</Text>
        <Text
          accessibilityRole="header"
          style={styles.headerTitle}
          numberOfLines={1}
        >
          {formatPokemonName(name)}
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
  backButton: {
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
  headerCopy: {
    flex: 1,
  },
  headerNumber: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
