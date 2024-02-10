import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const dashboardClient = {
  analytics({ customerId, state }: { customerId: string, state: string }) {
    console.log("analytics", customerId, state)
    return HttpClient.get<any>(API_ENDPOINTS.ANALYTICS, { params: { customerId, state } });
  }
};
