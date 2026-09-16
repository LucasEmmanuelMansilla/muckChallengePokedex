import { Image } from 'react-native';

const pokeBallImage = require('../assets/pokeball.png');

type PokeBallProps = {
  size?: number;
};

export function PokeBall({ size = 64 }: PokeBallProps) {
  return (
    <Image
      source={pokeBallImage}
      accessibilityLabel="Pokéball"
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}
