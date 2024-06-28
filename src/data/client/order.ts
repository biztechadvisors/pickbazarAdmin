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

  paginated: ({
    tracking_number,
    customer_id,
    ...params
  }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
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
