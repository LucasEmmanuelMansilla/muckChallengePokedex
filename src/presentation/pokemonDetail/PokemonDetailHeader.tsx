import { formatPokedexNumber, formatPokemonName } from '../formatPokemon';
import { PokedexBackButton } from '../PokedexBackButton';
import { PokedexHeader } from '../PokedexHeader';

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
    <PokedexHeader
      title={formatPokemonName(name)}
      subtitle={formatPokedexNumber(id)}
      leading={<PokedexBackButton onPress={onBack} />}
    />
  );
}
