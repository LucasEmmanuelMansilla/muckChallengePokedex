import type { ReactNode } from 'react';
import {
  NativeModules,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from './theme';

const ANDROID_NAVIGATION_BAR_DP = 48;
const IOS_HOME_INDICATOR_PT = 34;
const IOS_STATUS_BAR_FALLBACK = 47;
const IOS_CLASSIC_STATUS_BAR = 20;

type PokedexScreenProps = {
  header: ReactNode;
  children: ReactNode;
};

/**
 * Insets a mano en vez de react-native-safe-area-context (lib extra).
 * SafeAreaView de RN es iOS; en Android edge-to-edge hay que reservar
 * status bar y la barra de 3 botones o el listado queda debajo.
 */
export function PokedexScreen({ header, children }: PokedexScreenProps) {
  return (
    <View style={[styles.root, { paddingTop: statusBarInset() }]}>
      {header}
      <View style={[styles.body, { paddingBottom: navigationBarInset() }]}>
        {children}
      </View>
    </View>
  );
}

function statusBarInset(): number {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight ?? 0;
  }

  return iosStatusBarHeight();
}

function navigationBarInset(): number {
  if (Platform.OS === 'android') {
    // Edge-to-edge dibuja debajo de la barra de 3 botones; 48dp es su altura Material.
    return ANDROID_NAVIGATION_BAR_DP;
  }

  // Home indicator (~34pt) en iPhone con notch / Dynamic Island.
  return iosStatusBarHeight() > IOS_CLASSIC_STATUS_BAR
    ? IOS_HOME_INDICATOR_PT
    : 0;
}

function iosStatusBarHeight(): number {
  const height = NativeModules.StatusBarManager?.HEIGHT;
  return typeof height === 'number' ? height : IOS_STATUS_BAR_FALLBACK;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});
