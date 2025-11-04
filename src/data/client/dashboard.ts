import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const dashboardClient = {
  analytics(query: { customerId: number; state: string }) {
    console.log("query in dashboard client = ", query)
    return HttpClient.post<any>(API_ENDPOINTS.ANALYTICS, query);
  }
};