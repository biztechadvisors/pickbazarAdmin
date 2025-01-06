import {
  GetInspiredQueryOptions,
  GetInspired,
  GetInspiredInput,
  GetInspiredPaginator,
  Region, // Retained import for Region
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
export const getInspiredClient = {
  ...crudFactory<GetInspired, any, GetInspiredInput>(
    API_ENDPOINTS.GET_INSPIRED
  ),
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<GetInspired>(`${API_ENDPOINTS.GET_INSPIRED}/${id}`, {
      language,
    });
  },
  paginated: (params: Partial<GetInspiredQueryOptions>) => {
    const query = new URLSearchParams(params as Record<string, string>).toString(); 
    return HttpClient.get<GetInspiredPaginator>(
      `${API_ENDPOINTS.GET_INSPIRED}/shop?${query}` // Use /shop route
    );
  },
};


