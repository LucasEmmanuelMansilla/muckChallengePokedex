import { ScrollView, StyleSheet } from 'react-native';
import type { PokemonDetail } from '../../domain/Pokemon';
import { PokedexScreen } from '../PokedexScreen';
import { typeColor } from '../theme';
import { PokemonAbilities } from './PokemonAbilities';
import { PokemonDetailHeader } from './PokemonDetailHeader';
import { PokemonEggGroups } from './PokemonEggGroups';
import { PokemonFacts } from './PokemonFacts';
import { PokemonIdentity } from './PokemonIdentity';
import { PokemonStats } from './PokemonStats';

type PokemonDetailViewProps = {
  pokemon: PokemonDetail;
  onBack: () => void;
};

export function PokemonDetailView({ pokemon, onBack }: PokemonDetailViewProps) {
  const accent = typeColor(pokemon.types[0] ?? 'normal');

  return (
    <PokedexScreen
      header={
        <PokemonDetailHeader
          id={pokemon.id}
          name={pokemon.name}
          onBack={onBack}
        />
      }>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PokemonIdentity pokemon={pokemon} accent={accent} />
        <PokemonFacts pokemon={pokemon} />
        <PokemonAbilities abilities={pokemon.abilities} />
        <PokemonStats stats={pokemon.stats} accent={accent} />
        <PokemonEggGroups eggGroups={pokemon.eggGroups} />
      </ScrollView>
    </PokedexScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
});
