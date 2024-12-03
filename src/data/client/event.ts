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
   console.log("PARAMssss",params)
   const { shopSlug, page = 1, limit = 10, search = '', regionName = '', filter = '', startDate = '', endDate = '', location = '' } = params;
    console.log("shopSlug###",shopSlug)
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
      regionName,
      filter,
      startDate,
      endDate,
      location
    }).toString(); 
    return HttpClient.get(`${API_ENDPOINTS.EVENTS}/shop/${shopSlug}?${query}`);
  },

  delete: (params: any) => {
    const { id } = params;
    return HttpClient.delete<any>(`${API_ENDPOINTS.EVENTS}/${id}`);
  },
};
