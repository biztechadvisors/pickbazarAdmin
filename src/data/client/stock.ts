import { StaffQueryOptions, StaffPaginator, AddStaffInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const stockClient = {
  
  getbyId: (id: any) => {
    console.log("idStock", id)
    return HttpClient.get<any>(`${API_ENDPOINTS.STOCK}/${id}`);
  },
};
