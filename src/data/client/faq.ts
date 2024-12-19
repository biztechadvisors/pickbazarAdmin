import {
  CouponQueryOptions,
  Faq,
  FaqInput,
  FaqQueryOptions,
  Region,
  RegionInput,
  RegionPaginator,
  RegionsQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { VerifyCouponInputType, VerifyCouponResponse } from '@/types';

export const faqClient = {
  ...crudFactory<Faq, any, FaqInput>(API_ENDPOINTS.FAQ),
  get({ id, language }: { id: string; language: string }) {
   
    return HttpClient.get<Faq>(`${API_ENDPOINTS.FAQ}/${id}`, {
      language,
    });
  },
  paginated: ({ ...params }: { params: Partial<FaqQueryOptions> }) => {
  
    if (params.code) {
      return HttpClient.get<Region>(`${API_ENDPOINTS.FAQ}/shop/${params.code}`);
    }
  },
};
// }
