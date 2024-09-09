import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const eventClient = {
  create: (data: any) => {
    return HttpClient.post(API_ENDPOINTS.EVENTS, data);
  },
};
