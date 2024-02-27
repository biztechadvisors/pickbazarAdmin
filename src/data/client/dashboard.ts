import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const dashboardClient = {
  analytics(query: { customerId: number; state: string }) {
    return HttpClient.post<any>(API_ENDPOINTS.ANALYTICS, query);
  }
};
