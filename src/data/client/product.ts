// import {
//   Product,
//   CreateProduct,
//   ProductPaginator,
//   QueryOptions,
//   GetParams,
//   ProductQueryOptions,
//   GenerateDescriptionInput,
// } from '@/types';
// import { API_ENDPOINTS } from './api-endpoints';
// import { crudFactory } from './curd-factory';
// import { HttpClient } from './http-client';

// export const productClient = {
//   ...crudFactory<Product, QueryOptions, CreateProduct>(API_ENDPOINTS.PRODUCTS),

//   get({ slug, userId, language, shop_id }: GetParams) {
//     return HttpClient.get<Product>(
//       `${API_ENDPOINTS.PRODUCTS}/${slug}/${shop_id}`,
//       {
//         language,
//         with: 'type;shop;categories;tags;variations.attribute.values;variation_options;author;manufacturer;digital_file',
//       }
//     );
//   },

//   paginated: ({
//     type,
//     name,
//     slug,
//     categories,
//     shop_id,
//     dealerId,
//     ...params
//   }: Partial<ProductQueryOptions>) => {
//     return HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
//       dealerId,
//       shop_id,
//       searchJoin: 'and',
//       with: 'shop;type',
//       ...params,
//       // search: HttpClient.formatSearchParams({
//       //   type,
//       //   name,
//       //   slug,
//       //   categories,
//       // }),
//     });
//   },
//   popular({ shop_id, ...params }: Partial<ProductQueryOptions>) {
//     return HttpClient.get<Product[]>(API_ENDPOINTS.POPULAR_PRODUCTS, {
//       searchJoin: 'and',
//       with: 'type;shop',
//       ...params,
//       search: HttpClient.formatSearchParams({ shop_id }),
//     });
//   },
//   generateDescription: (data: GenerateDescriptionInput) => {
//     return HttpClient.post<any>(API_ENDPOINTS.GENERATE_DESCRIPTION, data);
//   },
//   updateQuantity: (data: any) => {
//     return HttpClient.post<any>(`${API_ENDPOINTS.PRODUCTS}/${data.id}`, data);
//   },
// };

import {
  Product,
  CreateProduct,
  ProductPaginator,
  QueryOptions,
  GetParams,
  ProductQueryOptions,
  GenerateDescriptionInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const productClient = {
  ...crudFactory<Product, QueryOptions, CreateProduct>(API_ENDPOINTS.PRODUCTS),

  get({ slug, id, language, shop_id }: GetParams) {

    console.log("slug___id", slug, id)
    return HttpClient.get<Product>(
      `${API_ENDPOINTS.PRODUCTS}/${slug}/${id}/${shop_id}`,
      {
        language,
        with: 'type;shop;categories;tags;variations.attribute.values;variation_options;author;manufacturer;digital_file',
      }
    );
  },

  paginated: ({
    id,
    type,
    name,
    slug,
    categories,
    tags,
    shop_id,
    dealerId,
    ...params
  }: Partial<ProductQueryOptions>) => {
    const filter = HttpClient.formatFilterParams({
      category: categories,
      tags,
      type,
    });
    return HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
      dealerId,
      shop_id,
      searchJoin: 'and',
      with: ' type',
      ...params,
      filter,
      // search: HttpClient.formatSearchParams({
      //   type,
      //   name,
      //   slug,
      //   categories,
      // }),
    });
  },
  popular({ shop_id, ...params }: Partial<ProductQueryOptions>) {
    return HttpClient.get<Product[]>(API_ENDPOINTS.POPULAR_PRODUCTS, {
      searchJoin: 'and',
      with: 'type',
      ...params,
      search: HttpClient.formatSearchParams({ shop_id }),
    });
  },
  generateDescription: (data: GenerateDescriptionInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.GENERATE_DESCRIPTION, data);
  },
  updateQuantity: (data: any) => {
    return HttpClient.post<any>(`${API_ENDPOINTS.PRODUCTS}/${data.id}`, data);
  },
};

// HttpClient.formatFilterParams = (filters: any) => {
//   return Object.entries(filters)
//     .filter(([key, value]) => value)
//     .map(([key, value]) => `${key}:${value}`)
//     .join(';');
// };