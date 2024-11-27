import {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  CreateCategoryInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const categoryClient = {
  ...crudFactory<Category, QueryOptions, CreateCategoryInput>(
    API_ENDPOINTS.CATEGORIES
  ),
  paginated: ({ shop, shopId, type, region_name, name, ...params }: Partial<CategoryQueryOptions>) => {
    return HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, {
      shop,
      shopId,
      searchJoin: 'and', 
      language:'en', 
      ...params,
      type,   
      // search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
