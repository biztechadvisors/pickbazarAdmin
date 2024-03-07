
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { analyticsClient } from './client/analytics';

export const useAnalyticsCustomer = (id: any) => {
    return useQuery(
      [API_ENDPOINTS.ANALYTICS, id],
      async () => {
        const response = await analyticsClient.getAnalyticsCustomer( id );
        return response;
      }
    );
  };

  export const useAnalyticsDealer = (id: any) => {
    return useQuery(
      [`${API_ENDPOINTS.ANALYTICS}/topDealers`, id],
      async () => {
        const response = await analyticsClient.getAnalyticsDealer( id );
        return response;
      }
    );
  };

  export const useAnalyticsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(analyticsClient.getAnalytics, {
      onSuccess: () => {
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ANALYTICS);
      },
    });
  };
  


