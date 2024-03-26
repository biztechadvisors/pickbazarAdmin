import {
  StaffQueryOptions,
  StaffPaginator,
  AddStaffInput,
  Order,
  OrderPaginator,
  OrderQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const stockClient = {
  getById: (id: number) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.STOCK}/${id}`);
  },

  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.STOCKBYID}/${id}`, {
      language,
    });
  },

  paginated: ({ tracking_number, ...params }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.STOCK, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ tracking_number }),
    });
  },

  fetchDealerStockData: async (id: any) => {
    return await HttpClient.get(`${API_ENDPOINTS.STOCK}/all/${id}`);
  },
  fetchDealerStockDataById: async (id: any) => {
    return await HttpClient.get(`${API_ENDPOINTS.STOCK}/${id}`);
  },

  updateStockData: async (user_id: any, updatedData: any) => {
    console.log("user_id", user_id)
    console.log("updateddata", updatedData)
    return await HttpClient.put(`${API_ENDPOINTS.STOCK}/${user_id}`, updatedData);
  }
};
