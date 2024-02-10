import { Product, ProductQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient } from '@/data/client/dashboard';
import { productClient } from '@/data/client/product';

export function useAnalyticsQuery(customerId: string, state: string) {
  console.log("customerId**,state**", typeof(customerId), state)
  return useQuery([API_ENDPOINTS.ANALYTICS], () => dashboardClient.analytics({ customerId, state }));
}

export function usePopularProductsQuery(options: Partial<ProductQueryOptions>) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      productClient.popular(Object.assign({}, pageParam, queryKey[1]))
  );
}
