
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { analyticsClient } from './client/analytics';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export const useAnalyticsCustomer = (id: any) => {
  console.log("input", id)
    return useQuery(
      [API_ENDPOINTS.ANALYTICS, id],
      async () => {
        const response = await analyticsClient.getAnalyticsCustomer( id );
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
  


