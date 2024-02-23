import { StaffQueryOptions, StaffPaginator, AddStaffInput, DealerQueryOptions, AddDealerInput, DealerPaginator } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const analyticsClient = {
  getAnalytics: ( input: any ) => {
    console.log("myinputs", input)
    return HttpClient.post<any>(`${API_ENDPOINTS.ANALYTICS}`, input);
  },
};
