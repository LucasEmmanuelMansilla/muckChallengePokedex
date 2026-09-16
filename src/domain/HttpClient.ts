export interface HttpClient {
  get<T>(path: string, query?: Record<string, string | number>): Promise<T>;
}
