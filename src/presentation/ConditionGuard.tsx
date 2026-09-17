import type { ReactNode } from 'react';

type ConditionGuardProps = {
  when: boolean;
  component: ReactNode;
  children: ReactNode;
};

/**
 * Swap del cuerpo (skeleton vs lista) sin que HomeScreen anide un ternario
 * alrededor del chrome. El header vive en PokedexScreen y no parpadea.
 */
export function ConditionGuard({
  when,
  component,
  children,
}: ConditionGuardProps) {
  return when ? component : children;
}
