/**
 * Puerto HTTP mínimo: la app solo lee. No copia la superficie de Axios
 * (verbos, interceptors, cancel tokens) para no acoplar el dominio a un
 * cliente concreto que hoy no hace falta.
 */
export interface HttpClient {
  get<T>(path: string, query?: Record<string, string | number>): Promise<T>;
}
