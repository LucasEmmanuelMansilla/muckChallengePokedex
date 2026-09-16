import type { ReactNode } from 'react';

type IndividualConditionGuardProps = {
  condition: boolean;
  children: ReactNode;
};

export function IndividualConditionGuard({ condition, children }: IndividualConditionGuardProps) {
  return condition ? children : null;
}
