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

  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.STOCKBYID}/${id}`, {
      language,
    });
  },

  paginated: ({ tracking_number, ...params }: Partial<OrderQueryOptions>) => {
    console.log('track', tracking_number);
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
    console.log('user_id', user_id);
    console.log('updateddata', updatedData);
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


  updateStockById:async ({params}:any)=>{
    console.log("paramsss", params)
  }
};




