import { memo } from 'react';
import { PokeBall } from '../PokeBall';
import { PokedexHeader } from '../PokedexHeader';

export const PokedexListHeader = memo(function PokedexListHeaderView() {
  return <PokedexHeader title="Pokédex" leading={<PokeBall size={36} />} />;
});
