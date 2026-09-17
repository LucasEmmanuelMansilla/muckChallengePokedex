import type { AppErrorCode } from '../domain/AppError';

export type ErrorSource = 'list' | 'detail' | 'render';

export type ErrorCopy = {
  title: string;
  message: string;
  actionLabel: string;
};

const TITLE = '¡La Pokebola se abrió mal!';
const RETRY_CAPTURE = 'Reintentar captura';

/**
 * El copy vive aquí y no en dominio: `AppError` es un código, no un texto.
 * Listado, ficha y render fallan distinto; el código solo no alcanza.
 */
export function errorCopy(
  source: ErrorSource | undefined,
  code: AppErrorCode | undefined,
): ErrorCopy {
  if (source === 'render') {
    return {
      title: TITLE,
      message: 'La Pokédex se trabó al mostrar la pantalla. Reintentá.',
      actionLabel: 'Reintentar',
    };
  }

  if (source === 'detail') {
    if (code === 'timeout') {
      return {
        title: TITLE,
        message:
          'La ficha tardó demasiado. Revisá tu conexión e intentá de nuevo.',
        actionLabel: RETRY_CAPTURE,
      };
    }

    if (code === 'not_found') {
      return {
        title: TITLE,
        message: 'No encontramos ese Pokémon. Volvé al listado o reintentá.',
        actionLabel: RETRY_CAPTURE,
      };
    }

    return {
      title: TITLE,
      message:
        'No pudimos cargar esta ficha. Revisá tu conexión e intentá de nuevo.',
      actionLabel: RETRY_CAPTURE,
    };
  }

  if (code === 'timeout') {
    return {
      title: TITLE,
      message:
        'La Pokédex tardó demasiado. Revisá tu conexión e intentá de nuevo.',
      actionLabel: RETRY_CAPTURE,
    };
  }

  return {
    title: TITLE,
    message:
      'No pudimos cargar los Pokemones. Revisá tu conexión e intentá de nuevo.',
    actionLabel: RETRY_CAPTURE,
  };
}
