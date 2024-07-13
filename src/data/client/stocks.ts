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
import { StockIdS } from '../stocks';

export const stockClient = {
  getById: (id: number) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.STOCK}/${id}`);
  },

  getByCustomer_id: (customer_id: number) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.DEALER_SEALS_STOCK}/${customer_id}`);
  },

  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.STOCKBYID}/${id}`, {
      language,
    });
  },

  paginated: ({ tracking_number, ...params }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.STOCK, {
      searchJoin: 'and',
      tracking_number,
      ...params,
      search: HttpClient.formatSearchParams({ tracking_number }),
    });
  },

  fetchDealerStockData: async (id: any) => {
    return await HttpClient.get(`${API_ENDPOINTS.STOCK}/user/${id}`);
  },
  fetchDealerStockDataById: async (id: any) => {
    return await HttpClient.get(`${API_ENDPOINTS.STOCK}/inventory/${id}`);
  },

  updateStockData: async (user_id: any, updatedData: any) => {
    return await HttpClient.put(
      `${API_ENDPOINTS.STOCK}/${user_id}`,
      updatedData
    );
  },

  // get stock by dealer id's

  getStockByOrderId: async ({ dealerId, orderId }: StockIdS) => {
    return await HttpClient.get(
      `${API_ENDPOINTS.STOCK}/user/${dealerId}/order/${orderId}`
    );
  },

  // update stock by admin

  updateStockDataById: async (user_id: any, updatedData: any) => {
    return await HttpClient.put(
      `${API_ENDPOINTS.STOCK}/update/admin/${user_id}`,
      updatedData
    );
  },


 // update stock by dealer

 updateStockDataByDealer: async (user_id: any, updatedData: any) => {
  return await HttpClient.put(
    `${API_ENDPOINTS.STOCK_DEALER_UPDATE}/${user_id}`,
    updatedData
  );
},
};
