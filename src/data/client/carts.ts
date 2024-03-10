
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const cartClient = {
  create: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.CARTS, input),
};
