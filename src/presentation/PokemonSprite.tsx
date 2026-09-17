import { memo, useState } from 'react';
import { Image } from 'react-native';
import { PokeBall } from './PokeBall';

type PokemonSpriteProps = {
  uri: string;
  size: number;
};

/**
 * Los sprites salen del CDN y no se persisten. Sin red, la ficha cacheada
 * sigue leyéndose y acá se muestra una Pokébola en vez de un hueco roto.
 */
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
      // La card/ficha ya anuncian el Pokémon; el sprite duplicaría el nombre.
      accessible={false}
      onError={() => setFailed(true)}
    />
  );
});
