import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const analyticsClient = {
  getAnalytics: ( input: any ) => {
    return HttpClient.post<any>(`${API_ENDPOINTS.ANALYTICS}`, input);
  },
  getAnalyticsCustomer: ( id: any ) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.ANALYTICS}/?userId=${id}`);
  },
  getAnalyticsDealer: ( id: any ) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.ANALYTICS}/topDealers/?userId=${id}`);
  },
};
