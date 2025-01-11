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
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<Region>(`${API_ENDPOINTS.REGIONS}/${id}`, {
      language,
    });
  },
  paginated: ({
      ...params
    }: { params: Partial<RegionsQueryOptions> }) => {
      if(params.code){
        return HttpClient.get<Region>(`${API_ENDPOINTS.REGIONS}/shop/${params.code}`)
      }
      ;
    }
}
// }