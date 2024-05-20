import { StaffQueryOptions, StaffPaginator, AddStaffInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const stockClient = {
  getById: (id: number) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.STOCK}/user/${id}`);
  },
  updateQuantity: (data: any) => {
    console.log('updateData', data);
    return HttpClient.put<any>(`${API_ENDPOINTS.STOCK}/${data.user_id}`, data);
  },
};
