import {
  CareerQueryOptions,
  Career,
  CareerInput,
  CareerPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const careersClient = {
  ...crudFactory<Career, any, CareerInput>(API_ENDPOINTS.CAREERS), // Update for careers
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<Career>(`${API_ENDPOINTS.CAREERS}/${id}`, {
      language,
    });
  },

  paginated: ({ ...params }: { params: Partial<CareerQueryOptions> }) => {
    console.log('params', params);
    if (params.shopSlug) {
      // Update to use query params for the shop slug
      return HttpClient.get<CareerPaginator>(
        `${API_ENDPOINTS.CAREERS}/shop/${params.shopSlug}` // Corrected URL structure
      );
    }
  },
};
