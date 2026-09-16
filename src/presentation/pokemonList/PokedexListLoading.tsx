import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '../theme';

export function PokedexListLoading() {
  return (
    <View
      style={styles.list}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando Pokédex…"
      accessibilityLiveRegion="polite"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

function SkeletonCard() {
  const opacity = usePulseOpacity();

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.copy}>
          <View style={styles.number} />
          <View style={styles.name} />
          <View style={styles.chips}>
            <View style={styles.chip} />
            <View style={styles.chip} />
          </View>
        </View>
        <View style={styles.sprite} />
      </View>
    </Animated.View>
  );
}

function usePulseOpacity() {
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    let cancelled = false;
    let animation: Animated.CompositeAnimation | undefined;

    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (cancelled || reduceMotion) {
        return;
      }

      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.55,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    });

    return () => {
      cancelled = true;
      animation?.stop();
    };
  }, [opacity]);

  return opacity;
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 124,
  },
  accent: {
    width: 7,
    backgroundColor: colors.line,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 8,
  },
  number: {
    width: 64,
    height: 10,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  name: {
    width: '70%',
    height: 18,
    borderRadius: 6,
    backgroundColor: colors.line,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    width: 56,
    height: 22,
    borderRadius: 999,
    backgroundColor: colors.line,
  },
  sprite: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.line,
  },
});
