import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { mapPaginatorData } from '@/utils/data-mappers';
import {
  OrderQueryOptions,
  OrderPaginator,
  Order,
  InvoiceTranslatedText,
  CreateOrderInput,
} from '@/types';
import { orderClient, orderStocks } from './client/order';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { HttpClient } from './client/http-client';
import {backendApi} from "@/utils/constants";

export const useOrdersQuery = (
  params: Partial<OrderQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.ORDERS, params],
    ({ queryKey, pageParam }) =>
      orderClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );
  return {
    orders: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useOrderQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Order, Error>(
    [API_ENDPOINTS.ORDERS, { id, language }],
    () => orderClient.get({ id, language })
  );
  return {
    order: data,
    error,
    isLoading,
  };
};

export const useOrderStocksQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Order, Error>(
    [API_ENDPOINTS.DEALER_SEALS_STOCK_BY_ID, { id, language }],
    () => orderStocks.get({ id, language })
  );

  return {
    order: data,
    error,
    isLoading,
  };
};

// export const useCreateOrderMutation = () => {
//   return useMutation(orderClient.create);
// };

export function useCreateOrderMutation() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();

  const { mutate: createOrder, isLoading } = useMutation(orderClient.create, {
    onSuccess: (data: any) => {
      if (data?.id) {
        router.push(`${Routes.order.list}/${data?.id}`);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  function formatOrderInput(input: CreateOrderInput) {
    const formattedInputs = {
      ...input,
      language: locale,
      // TODO: Make it for Graphql too
      invoice_translated_text: {
        subtotal: t('order-sub-total'),
        discount: t('order-discount'),
        tax: t('order-tax'),
        delivery_fee: t('order-delivery-fee'),
        total: t('order-total'),
        products: t('text-products'),
        quantity: t('text-quantity'),
        invoice_no: t('text-invoice-no'),
        date: t('text-date'),
      },
    };
    createOrder(formattedInputs);
  }

  return {
    createOrder: formatOrderInput,
    isLoading,
  };
}

// export const useUpdateOrderMutation = () => {
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();
//   return useMutation(orderClient.update, {
//     onSuccess: () => {
//       toast.success(t('common:successfully-updated'));
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
//     },
//   });
// };



export const useUpdateOrderMutation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, name, color, serial, language }: { id: string; name: string; color: string; serial: number; language: string }) => {
      // console.log('ID:', id);
      // console.log('Data-status:', { name, color, serial, language });

      // Check if name (order status) is valid
      if (!name) {
        throw new Error('Order status name is undefined');
      }

      // API endpoint with the dynamic ID
      const url = `${backendApi}/order-status/${id}`;

      // Data object to send in the PUT request
      const data = { name, color, serial, language };

      console.log('Sending data to server:', data); // Log the data object
      return await HttpClient.put(url, data); // PUT request with the data
    },
    {
      onSuccess: () => {
        toast.success(t('common:successfully-updated'));
        return router.push('/orders')
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDER_STATUS);
      },
    }
  );
};


export const useDealerStatusChange = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, order_status }: { id: string; order_status: string }) => {
      console.log('ID:', id);
      console.log('Status:', order_status);

      if (!order_status) {
        throw new Error('Status is undefined');
      }

      const url = `${API_ENDPOINTS.DEALER_STATUS_CHANGE}/${id}/status`;
      const data = { name: order_status };

      console.log('Sending data to server:', data); // Log the data object
      return await HttpClient.patch(url, data);
    },
    {
      onSuccess: () => {
        toast.success(t('common:successfully-updated'));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.DEALER_STATUS_CHANGE);
      },
    }
  );
};


// export const usDealerStatusChange = () => {
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();
//   return useMutation(orderStocks.update, {
//     onSuccess: () => {
//       toast.success(t('common:successfully-updated'));
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.DEALER_STATUS_CHANGE);
//     },
//   });
// };



export const useDownloadInvoiceMutation = (
  {
    order_id,
    isRTL,
    language,
  }: { order_id: string; isRTL: boolean; language: string },
  options: any = {}
) => {
  const { t } = useTranslation();
  const formattedInput = {
    order_id,
    is_rtl: isRTL,
    language,
    translated_text: {
      subtotal: t('order-sub-total'),
      discount: t('order-discount'),
      tax: t('order-tax'),
      delivery_fee: t('order-delivery-fee'),
      total: t('order-total'),
      products: t('text-products'),
      quantity: t('text-quantity'),
      invoice_no: t('text-invoice-no'),
      date: t('text-date'),
    },
  };

  return useQuery<any, Error>(
    [API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD],
    () => orderClient.downloadInvoice(formattedInput),
    {
      ...options,
    }
  );
};
