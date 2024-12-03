import {
  Order,
  CreateOrderInput,
  OrderQueryOptions,
  OrderPaginator,
  QueryOptions,
  InvoiceTranslatedText,
  GenerateInvoiceDownloadUrlInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const orderClient = {
  ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.ORDERS),

  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, {
      language,
    });
  },

  // paginated: ({
  //   tracking_number,
  //   customer_id,
  //   ...params
  // }: Partial<OrderQueryOptions>) => {
  //   return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
  //     searchJoin: customer_id,
  //     ...params,
  //     customer_id: HttpClient.formatSearchParams({ tracking_number, customer_id }),
  //   });
  // },

  paginated: ({    
    customer_id,
    ...params
  }: Partial<OrderQueryOptions>) => {
    console.log("params",params)
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
      ...params,
      customer_id, 
      
    });
  },





  downloadInvoice: (input: GenerateInvoiceDownloadUrlInput) => {
    return HttpClient.post<string>(
      `${API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD}`,
      input
    );
  },
};



export const orderStocks = {
  ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.DEALER_SEALS_STOCK_BY_ID),

  // get: ({ id }: { id: string }) => {
  //   return HttpClient.get<Order>(`${API_ENDPOINTS.DEALER_SEALS_STOCK_BY_ID}/:${id}`);
  // },

  get: ({ id }: { id: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.DEALER_SEALS_STOCK_BY_ID}/${id}`);
},



  paginated: ({
    tracking_number,
    customer_id,
    ...params
  }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.DEALER_SEALS_STOCK_BY_ID, {
      searchJoin: customer_id,
      ...params,
      search: HttpClient.formatSearchParams({ tracking_number, customer_id }),
    });
  },

  downloadInvoice: (input: GenerateInvoiceDownloadUrlInput) => {
    return HttpClient.post<string>(
      `${API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD}`,
      input
    );
  },
};
