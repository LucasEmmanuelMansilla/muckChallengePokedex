import { useEffect, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';

type FadeInProps = {
  children: ReactNode;
};

export function FadeIn({ children }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    let animation: Animated.CompositeAnimation | undefined;

    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (cancelled) {
        return;
      }

      if (reduceMotion) {
        opacity.setValue(1);
        return;
      }

      animation = Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      });
      animation.start();
    });

    return () => {
      cancelled = true;
      animation?.stop();
    };
  }, [opacity]);

  return (
    <Animated.View style={[styles.fill, { opacity }]}>{children}</Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
