import { memo } from 'react';
import { Image } from 'react-native';

const pokeBallImage = require('../assets/pokeball.png');

type PokeBallProps = {
  size?: number;
};

export const PokeBall = memo(function PokeBall({ size = 64 }: PokeBallProps) {
  return (
    <Image
      source={pokeBallImage}
      accessible={false}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
});
