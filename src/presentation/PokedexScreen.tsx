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

function navigationBarInset(): number {
  if (Platform.OS !== 'android') {
    return 0;
  }

  // Edge-to-edge dibuja debajo de la barra de 3 botones; 48dp es su altura Material.
  return 48;
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
    paddingBottom: navigationBarInset(),
  },
});
