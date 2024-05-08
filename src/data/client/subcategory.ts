import {
    SubCategory,
    SubCategoryPaginator,
    SubCategoryQueryOptions,
    CreateSubCategoryInput,
    QueryOptions,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { crudFactory } from './curd-factory';
  import { HttpClient } from './http-client';
  
  export const subcategoryClient = {
    ...crudFactory<SubCategory, QueryOptions, CreateSubCategoryInput>(
      API_ENDPOINTS.SUBCATEGORIES
    ),
    paginated: ({ type, name, ...params }: Partial<SubCategoryQueryOptions>) => {
      console.log("param++++++++++", params)
      return HttpClient.get<SubCategoryPaginator>(API_ENDPOINTS.SUBCATEGORIES, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ type, name }),
      });
    },
  };
  