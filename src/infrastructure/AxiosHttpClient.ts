import type { AxiosInstance } from 'axios';
import type { HttpClient } from '../domain/HttpClient';

export class AxiosHttpClient implements HttpClient {
  constructor(private readonly client: AxiosInstance) {}

  async get<T>(
    path: string,
    query?: Record<string, string | number>,
  ): Promise<T> {
    const { data } = await this.client.get<T>(path, { params: query });
    return data;
  }
}
