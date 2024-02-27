import { StaffQueryOptions, StaffPaginator, AddStaffInput, DealerQueryOptions, AddDealerInput, DealerPaginator } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const analyticsClient = {
  getAnalytics: ( input: any ) => {
    console.log("myinputs", input)
    return HttpClient.post<any>(`${API_ENDPOINTS.ANALYTICS}`, input);
  },
  getAnalyticsCustomer: ( id: any ) => {
    console.log("myinputs2", id)
    return HttpClient.get<any>(`${API_ENDPOINTS.ANALYTICS}/?userId=${id}`);
  },
};
