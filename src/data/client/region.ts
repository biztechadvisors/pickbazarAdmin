import {
    CouponQueryOptions,
    Region,
    RegionInput,
    RegionPaginator,
    RegionsQueryOptions,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { crudFactory } from './curd-factory';
  import { HttpClient } from './http-client';
  import { VerifyCouponInputType, VerifyCouponResponse } from '@/types';
  
  export const regionClient = {
    ...crudFactory<Region, any, RegionInput>(API_ENDPOINTS.REGIONS),
    // get({ code, language }: { code: string; language: string }) {
    //   return HttpClient.get<Coupon>(`${API_ENDPOINTS.COUPONS}/${code}`, {
    //     language,
    //   });
    // },
    get: ({ code }:  Partial<RegionsQueryOptions>) => {
        console.log('code = ',code)
        return HttpClient.get<Region>(`${API_ENDPOINTS.REGIONS}/shop/${code}`);
      },

      paginated: ({    
        code,
        shopSlug,
        ...params
      }: { code?: string; } & Partial<RegionsQueryOptions>) => {
        console.log("params",params)
        return HttpClient.get<Region>(API_ENDPOINTS.REGIONS, {
          ...params,
          code,
          shopSlug
        });

        // paginated: ({    
        //     code,
        //     ...params
        //   }: { code?: string; } & Partial<RegionsQueryOptions>) => {
        //     console.log("params",params)
        //     return HttpClient.get<Region>(API_ENDPOINTS.REGIONS, {
        //       ...params,
        //       code,
        //     });
          
      
      
    //   paginated: ({ code, ...params }: Partial<RegionsQueryOptions>) => {
       
    //     if (!code) {
    //       console.error('shopSlug is missing, cannot fetch regions.');
    //       return Promise.reject(new Error('Shop slug is required to fetch regions.'));
    //     }
    //     console.log('params =', params);
    //     return HttpClient.get<Region>(
    //       `${API_ENDPOINTS.REGIONS}/shop/${code}`, 
    //       { params }
    //     );
    //   },
  }
}
  

