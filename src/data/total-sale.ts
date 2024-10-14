// import { Product, ProductQueryOptions } from '@/types';
// import { useQuery } from 'react-query';
// import { API_ENDPOINTS } from './client/api-endpoints';
// import { dashboardClient } from '@/data/client/dashboard';
// import { productClient } from '@/data/client/product';
// import { totalSale } from './client/total-sale';

// // export function usetotalSale() {
// //   return useQuery([API_ENDPOINTS.ANALYTICS], totalSale.analytics);
// // }

// export function usetotalSale(customerId: string, state: string) {
//     return useQuery([API_ENDPOINTS.ANALYTICS, { customerId, state }], () => totalSale.analytics(customerId, state));
//   }
  
  


import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { totalSale } from './client/total-sale';

// The name of the hook should start with 'use' and be in camel case
export function useTotalSale(customerId: string, state: string) {
  return useQuery(
    [API_ENDPOINTS.ANALYTICS, { customerId, state }],
    () => totalSale.analytics(customerId, state)
  );
}
