import { Product, ProductQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient } from '@/data/client/dashboard';
import { productClient } from '@/data/client/product';

export function useAnalyticsQuery(query: { customerId: number; state: string }) {
  const { data, error, isLoading } = useQuery([API_ENDPOINTS.ANALYTICS, query], async () => {
    try {
      const result = await dashboardClient.analytics(query);
      return result;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  });
  return { data, error, isLoading };
}



export function usePopularProductsQuery(options: Partial<ProductQueryOptions>) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      productClient.popular(Object.assign({}, pageParam, queryKey[1]))
  );
}
