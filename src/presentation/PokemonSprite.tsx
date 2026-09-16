import { memo, useState } from 'react';
import { Image } from 'react-native';
import { PokeBall } from './PokeBall';

type PokemonSpriteProps = {
  uri: string;
  size: number;
};

export const PokemonSprite = memo(function PokemonSprite({
  uri,
  size,
}: PokemonSpriteProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <PokeBall size={Math.round(size * 0.72)} />;
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      accessible={false}
      onError={() => setFailed(true)}
    />
  );
});
