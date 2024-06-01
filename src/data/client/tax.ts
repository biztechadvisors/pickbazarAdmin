import {
  Tax,
  QueryOptions,
  TaxInput,
  TaxQueryOptions,
  TaxPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from '@/data/client/http-client';

export const taxClient = {
  ...crudFactory<Tax, QueryOptions, TaxInput>(API_ENDPOINTS.TAXES),
  get({ id }: { id: string }) {
    return HttpClient.get<Tax>(`${API_ENDPOINTS.TAXES}/${id}`);
  },
  paginated: ({ name,shop_id, ...params }: Partial<TaxQueryOptions>) => {
    return HttpClient.get<TaxPaginator>(API_ENDPOINTS.TAXES, {
      searchJoin: 'and',
      ...params,
      shopId:shop_id,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  all: ({ name, shop_id, ...params }: Partial<TaxQueryOptions>) => {
    return HttpClient.get<Tax[]>(API_ENDPOINTS.TAXES, {
      searchJoin: 'and',
      shopId:shop_id,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
