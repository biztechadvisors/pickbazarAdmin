import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const dashboardClient = {
  analytics(query: { customerId: number; state: string }) {
    const { customerId, state } = query;
    console.log("analytics", customerId, state);
    return HttpClient.get<any>(API_ENDPOINTS.ANALYTICS, { params: { customerId, state } });
  }
};
