import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const exportClient = {
  exportOrder: ({ shop_id }: { shop_id?: string }) => {
    const url = shop_id
      ? `${API_ENDPOINTS.STOCKBYID}/${shop_id}`
      : API_ENDPOINTS.STOCKBYID;

    return HttpClient.get<string>(url);
  },
};
