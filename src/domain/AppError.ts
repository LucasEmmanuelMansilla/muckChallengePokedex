/**
 * Códigos cerrados para que la UI elija copy sin inspeccionar mensajes
 * de fetch ni status HTTP. `unknown` es el cajón para no dejar un error
 * sin código y forzar un estado de error genérico.
 */
export type AppErrorCode = 'network' | 'timeout' | 'not_found' | 'unknown';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'AppError';
    this.code = code;
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // FetchHttpClient aborta por deadline; AbortError es timeout, no "red caída".
  if (isAbortError(error)) {
    return new AppError('timeout');
  }

  if (error instanceof Error) {
    return new AppError('network', error.message);
  }

  return new AppError('unknown');
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'AbortError'
  );
}
