import type { ReactNode } from 'react';
import {
  NativeModules,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from './theme';

type PokedexScreenProps = {
  header: ReactNode;
  children: ReactNode;
};

export function PokedexScreen({ header, children }: PokedexScreenProps) {
  return (
    <View style={styles.root}>
      {header}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

function statusBarInset(): number {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight ?? 0;
  }

  const height = NativeModules.StatusBarManager?.HEIGHT;
  return typeof height === 'number' ? height : 47;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: statusBarInset(),
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});
