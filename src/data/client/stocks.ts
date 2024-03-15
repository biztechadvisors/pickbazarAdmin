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
};
