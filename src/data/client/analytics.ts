import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const analyticsClient = {
  getAnalytics: ( input: any ) => {
    console.log("input in analytics client = ", input)
    return HttpClient.post<any>(`${API_ENDPOINTS.ANALYTICS}`, input);
  },
  getAnalyticsCustomer: ( id: any ) => {
    console.log("id in analytics client = ", id)
    return HttpClient.get<any>(`${API_ENDPOINTS.ANALYTICS}/?userId=${id}`);
  },
  getAnalyticsDealer: ( id: any ) => {
    console.log("id in analytics client = ", id)
    return HttpClient.get<any>(`${API_ENDPOINTS.ANALYTICS}/topDealers/?userId=${id}`);
  },
};
