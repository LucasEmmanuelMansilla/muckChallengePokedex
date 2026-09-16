import { AppError, toAppError } from '../src/domain/AppError';
import { errorCopy } from '../src/presentation/errorCopy';

describe('toAppError', () => {
  it('conserva un AppError y traduce abort a timeout', () => {
    const original = new AppError('not_found', 'HTTP 404');
    expect(toAppError(original)).toBe(original);

    const abort = Object.assign(new Error('Aborted'), { name: 'AbortError' });
    expect(toAppError(abort)).toMatchObject({
      name: 'AppError',
      code: 'timeout',
    });
  });
});

describe('errorCopy', () => {
  it('distingue listado, ficha y un crash de render', () => {
    expect(errorCopy('list', 'network').message).toContain(
      'cargar los Pokemones',
    );
    expect(errorCopy('detail', 'network').message).toContain('esta ficha');
    expect(errorCopy('detail', 'not_found').message).toContain(
      'No encontramos ese Pokémon',
    );
    expect(errorCopy('list', 'timeout').message).toContain('tardó demasiado');
    expect(errorCopy('render', 'unknown').actionLabel).toBe('Reintentar');
  });
});
