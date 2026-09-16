import type { ReactNode } from 'react';

type ConditionGuardProps = {
  when: boolean;
  component: ReactNode;
  children: ReactNode;
};

export function ConditionGuard({
  when,
  component,
  children,
}: ConditionGuardProps) {
  return when ? component : children;
}
