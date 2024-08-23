import { StaffQueryOptions, StaffPaginator, AddStaffInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const stockClient = {
  getById: (id: number) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.STOCK}/inventory/${id}`);
  },
  getByCustomer_id: (customer_id: number, shop_id: string) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.DEALER_SEALS_STOCK}?customer_id=${customer_id},shop_id=${shop_id}`);
  },
  updateQuantity: (data: any) => {
    return HttpClient.put<any>(`${API_ENDPOINTS.STOCK}/${data.user_id}`, data);
  },
};


