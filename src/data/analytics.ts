
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { analyticsClient } from './client/analytics';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

// export const useAnalyticsGet = (input: any) => {
//   console.log("input", input)
//     return useQuery(
//       [API_ENDPOINTS.ANALYTICS, input],
//       async () => {
//         const response = await analyticsClient.getAnalytics( input );
//         return response;  // Wrap the response in an object
//       }
//     );
//   };

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
  


