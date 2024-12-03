import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const eventClient = {
  create: (data: any) => {
    return HttpClient.post(API_ENDPOINTS.EVENTS, data);
  },
  update: ({ id, ...input }: any) => {
    return HttpClient.put(`${API_ENDPOINTS.EVENTS}/${id}`, input);
  },

  singleData: ({ id }: any) => {
    return HttpClient.get(`${API_ENDPOINTS.EVENTS}/${id}`);
  },

  getAll: (params: any) => {
    const { shopSlug } = params;
    return HttpClient.get(`${API_ENDPOINTS.EVENTS}/shop/${shopSlug}`);
  },

  delete: (params: any) => {
    const { id } = params;
    return HttpClient.delete<any>(`${API_ENDPOINTS.EVENTS}/${id}`);
  },
};
