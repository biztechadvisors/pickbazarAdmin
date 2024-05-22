import { Product, ProductQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient } from '@/data/client/dashboard';
import { productClient } from '@/data/client/product';
import { useMemo } from 'react';

export function useAnalyticsQuery(query: { customerId: number; state: string }) {
  const memoizedQuery = useMemo(() => query, [query.customerId, query.state]);

  return useQuery(
    [API_ENDPOINTS.ANALYTICS, memoizedQuery],
    async () => {
      try {
        const result = await dashboardClient.analytics(memoizedQuery);
        return result;
      } catch (error) {
        console.error('Error fetching analytics data:', error);

        // Type assertion
        if (error instanceof Error) {
          throw new Error(error.message || 'Error fetching analytics data');
        }
        // If error is not an instance of Error
        throw new Error('Error fetching analytics data');
      }
    },
    {
      keepPreviousData: true, // Keeps previous data while fetching new data
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 24 * 60 * 60 * 1000 * 24, // 24 days
      cacheTime: 24 * 60 * 60 * 1000 * 24, // 24 days
      retry: false, // Disable automatic retries on failure
      onSuccess: (data) => {
        // Handle successful response here
        console.log('Data fetched successfully:', data);
      },
      onError: (error) => {
        // Handle error here
        console.error('Error fetching data:', error);
      }
    }
  );
}


export function usePopularProductsQuery(options: Partial<ProductQueryOptions>) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      productClient.popular(Object.assign({}, pageParam, queryKey[1]))
  );
}
