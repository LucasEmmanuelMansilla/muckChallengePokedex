import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConditionGuard } from '../components/ConditionGuard';
import { PokeBall } from '../src/presentation/PokeBall';
import { PokemonCard } from '../src/presentation/PokemonCard';
import { colors } from '../src/presentation/theme';
import { usePokemonList } from '../src/presentation/usePokemonList';

export default function HomeScreen() {
  const { pokemon, isLoading } = usePokemonList();

  return (
    <ConditionGuard
      when={isLoading}
      component={
        <SafeAreaView style={styles.screen} edges={['top']}>
          <HomeHeader />
          <View style={styles.listWrap}>
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={styles.loadingLabel}>Cargando Pokédex…</Text>
            </View>
          </View>
        </SafeAreaView>
      }>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <HomeHeader />
        <View style={styles.listWrap}>
          <FlatList
            data={pokemon}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <PokemonCard pokemon={item} />}
          />
        </View>
      </SafeAreaView>
    </ConditionGuard>
  );
}

function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <PokeBall size={36} />
        <View>
          <Text style={styles.title}>Pokédex</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    color: colors.headerMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  listWrap: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
});
