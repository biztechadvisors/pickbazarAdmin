import { crudFactory } from '@/data/client/curd-factory';
import {
  Attribute,
  AttributePaginator,
  AttributeQueryOptions,
  CreateAttributeInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const attributeClient = {
  ...crudFactory<Attribute, QueryOptions, CreateAttributeInput>(
    API_ENDPOINTS.ATTRIBUTES
  ),
  paginated: ({
    shop_id,
    type,
    name,
    ...params
  }: Partial<AttributeQueryOptions>) => {
    return HttpClient.get<AttributePaginator>(API_ENDPOINTS.ATTRIBUTES, {
      shop_id: shop_id,
      searchJoin: 'and',
      ...params,
      type,
      name,
      language: 'en',
    });
  },
  all: ({ shop_id, type, name, ...params }: Partial<AttributeQueryOptions>) => {
    return HttpClient.get<Attribute[]>(API_ENDPOINTS.ATTRIBUTES, {
      shop_id: shop_id,
      searchJoin: 'and',
      ...params,
      type,
      name,
    });
  },
};
