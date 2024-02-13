import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

// export const totalSale = {
//   analytics() {
//     return HttpClient.get<any>(API_ENDPOINTS.ANALYTICS);
//   },
// };

export const totalSale = {
    analytics(customerId: string, state: string) {
      return HttpClient.get<any>(`${API_ENDPOINTS.ANALYTICS}?customerId=${customerId}&state=${state}`);
    },
  };
