import { useNavigation } from '../../navigation/NavigationContext';
import { errorCopy } from '../errorCopy';
import { PokedexHeader } from '../PokedexHeader';
import { PokedexScreen } from '../PokedexScreen';
import { PokedexStatus } from '../PokedexStatus';

export default function ErrorScreen() {
  const { retry, failure } = useNavigation();
  const copy = errorCopy(failure?.source, failure?.error.code);

  return (
    <PokedexScreen header={<PokedexHeader title="Pokédex" />}>
      <PokedexStatus
        fill
        title={copy.title}
        message={copy.message}
        actionLabel={copy.actionLabel}
        onAction={retry}
      />
    </PokedexScreen>
  );
}
