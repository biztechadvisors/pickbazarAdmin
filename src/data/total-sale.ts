import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { totalSale } from './client/total-sale';

// Custom Hook to fetch total sales based on customerId and state
export function useTotalSale(customerId: string, state: string) {
  return useQuery([API_ENDPOINTS.ANALYTICS, { customerId, state }], () => totalSale.analytics(customerId, state));
}
 


