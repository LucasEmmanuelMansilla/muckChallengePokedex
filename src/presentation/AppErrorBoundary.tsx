import { Component, type ErrorInfo, type ReactNode } from 'react';
import { errorCopy } from './errorCopy';
import { PokedexHeader } from './PokedexHeader';
import { PokedexScreen } from './PokedexScreen';
import { PokedexStatus } from './PokedexStatus';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Los error boundaries de React solo existen como class components.
 * Cubre fallos de render (no de fetch: esos van a ErrorScreen).
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const copy = errorCopy('render', 'unknown');

    return (
      <PokedexScreen header={<PokedexHeader title="Pokédex" />}>
        <PokedexStatus
          fill
          title={copy.title}
          message={copy.message}
          actionLabel={copy.actionLabel}
          actionHint="Vuelve a intentar mostrar la Pokédex"
          onAction={() => this.setState({ hasError: false })}
        />
      </PokedexScreen>
    );
  }
}
