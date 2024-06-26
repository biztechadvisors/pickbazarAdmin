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
    console.log('first--18')
    return HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, {
      language,
    });
  },

  paginated: ({ tracking_number, ...params }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ tracking_number }),
    });
  },

  downloadInvoice: (input: GenerateInvoiceDownloadUrlInput) => {
    console.log('downloadInvoice***', input);
    return HttpClient.post<string>(
      `${API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD}`,
      input
    );
  },
};
