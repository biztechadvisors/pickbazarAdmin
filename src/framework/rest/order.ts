import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  CreateRefundInput,
  CreateStockInput,
  DownloadableFilePaginator,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  PaymentGateway,
  QueryOptions,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { API_ENDPOINTS } from './client/api-endpoints';
import client from './client';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/contexts/checkout';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { mapPaginatorData } from '@/framework/rest/utils/data-mappers';
import { isArray, isObject, isEmpty } from 'lodash';
import { UserService } from './user';

// Orders List Hook
export function useOrders(options?: Partial<OrderQueryOptions>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.ORDERS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
      refetchOnWindowFocus: false,
    }
  );

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    orders: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

// Single Order Hook
export function useOrder({ tracking_number }: { tracking_number: string }) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    Order,
    Error
  >(
    [API_ENDPOINTS.ORDERS, tracking_number],
    () => client.orders.get(tracking_number),
    {
      refetchOnWindowFocus: false,
      enabled: !!tracking_number,
    }
  );

  return {
    order: data,
    isFetching,
    isLoading,
    refetch,
    error,
  };
}

// Refunds Hook
export function useRefunds(options: Pick<QueryOptions, 'limit'>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery(
    [API_ENDPOINTS.ORDERS_REFUNDS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.refunds(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    refunds: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

// Downloadable Products Hook
export const useDownloadableProducts = (
  options: Pick<QueryOptions, 'limit'>
) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<DownloadableFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
      refetchOnWindowFocus: false,
    }
  );

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    downloads: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

// Create Refund Hook
export function useCreateRefund() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();

  const { mutate: createRefundRequest, isLoading } = useMutation(
    client.orders.createRefund,
    {
      onSuccess: () => {
        toast.success(t('text-refund-request-submitted'));
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || t('error-something-went-wrong'));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
        closeModal();
      },
    }
  );

  const formatRefundInput = (input: CreateRefundInput) => {
    createRefundRequest({
      ...input,
      language: locale,
    });
  };

  return {
    createRefundRequest: formatRefundInput,
    isLoading,
  };
}

// Order Creation Hooks
export function useCreateOrder() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const { username } = UserService.getUserDetails();
  const queryClient = useQueryClient();

  const { mutate: createOrder, isLoading } = useMutation(
    client.orders.create,
    {
      onSuccess: async (response) => {
        try {
          const { id, payment_gateway, payments } = response;

          if (!id) {
            throw new Error('Order ID not received');
          }

          queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);

          const idStr = id.toString();

          // Handle different payment gateways
          if ([
            PaymentGateway.COD,
            PaymentGateway.CASH,
            PaymentGateway.FULL_WALLET_PAYMENT,
          ].includes(payment_gateway as PaymentGateway)) {
            return router.push(Routes.orders(idStr));
          }
          // Check for redirect payment
          const paymentIntent = payments?.[0];
          if (paymentIntent?.is_redirect && paymentIntent?.redirect_url) {
            router.push(paymentIntent.redirect_url);
          }
          // Default case - go to payment page
          router.push(`${Routes.orders(idStr)}/payment`);
        } catch (error) {
          console.error('Order creation success handling failed:', error);
          toast.error(t('error-something-went-wrong'));
        }
      },
      onError: (error: any) => {
        console.error('Order creation failed:', error);
        const errorMessage = error?.response?.data?.message || t('error-something-went-wrong');
        toast.error(errorMessage);
      },
    }
  );

  const { mutate: createStock } = useMutation(client.stocks.create, {
    onError: (error: any) => {
      console.error('Stock creation failed:', error);
      toast.error(error?.response?.data?.message || t('error-stock-creation-failed'));
    },
  });

  const checkAndCreateStocks = async (input: CreateOrderInput) => {
    if (input.dealerId && input.dealerId === input.customer_id) {
      try {
        await createStock({
          user_id: parseInt(input.dealerId),
          products: input.products,
        });
      } catch (error) {
        console.error('Stock creation failed:', error);
      }
    }
  };

  const formatOrderInput = (input: CreateOrderInput) => {
    const formattedInput: CreateOrderInput = {
      ...input,
      language: locale,
      dealer: input.dealerId,
      dealerEmail: username,
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

    // Create stocks if needed (fire and forget)
    if (input.dealerId && input.dealerId === input.customer_id) {
      checkAndCreateStocks(input);
    }

    // Create the order
    createOrder(formattedInput);
  };

  return {
    createOrder: formatOrderInput,
    isLoading,
  };
}

// Stock Order Creation Hook
export function useCreateOrderByStock() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const { username } = UserService.getUserDetails();
  const queryClient = useQueryClient();

  const { mutate: createOrderFromStock, isLoading } = useMutation(
    client.stocks.orderByStock,
    {
      onSuccess: (response) => {
        try {
          console.log("response 352 ", response)
          const { id, payment_gateway, payment_intent } = response;

          if (!id) {
            throw new Error('Order ID not received');
          }

          queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);

          const idStr = id.toString();

          if ([
            PaymentGateway.COD,
            PaymentGateway.CASH,
            PaymentGateway.FULL_WALLET_PAYMENT,
          ].includes(payment_gateway as PaymentGateway)) {
            return router.push(Routes.sale(idStr));
          }

          if (payment_intent?.[0]?.is_redirect && payment_intent?.[0]?.redirect_url) {
            return router.push(payment_intent[0].redirect_url);
          }

          router.push(`${Routes.sale(idStr)}/payment`);
        } catch (error) {
          console.error('Order from stock success handling failed:', error);
          toast.error(t('error-something-went-wrong'));
        }
      },
      onError: (error: any) => {
        console.error('Order from stock creation failed:', error);
        const errorMessage = error?.response?.data?.message || t('error-something-went-wrong');
        toast.error(errorMessage);
      },
    }
  );

  const formatOrderInput = (input: CreateOrderInput) => {
    const formattedInput = {
      ...input,
      language: locale,
      dealer: input.dealerId,
      dealerEmail: username,
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

    createOrderFromStock(formattedInput);
  };

  return {
    createOrderFromStock: formatOrderInput,
    isLoading,
  };
}

// Downloadable URL Generation Hook
export function useGenerateDownloadableUrl() {
  const { mutate: getDownloadableUrl } = useMutation(
    client.orders.generateDownloadLink,
    {
      onSuccess: (data) => {
        const downloadFile = (fileUrl: string, fileName: string) => {
          const a = document.createElement('a');
          a.href = fileUrl;
          a.setAttribute('download', fileName);
          a.click();
        };

        downloadFile(data, 'download.pdf');
      },
      onError: () => {
        toast.error('Failed to generate download link');
      },
    }
  );

  const generateDownloadableUrl = (digital_file_id: string) => {
    getDownloadableUrl({ digital_file_id });
  };

  return {
    generateDownloadableUrl,
  };
}

// Order Verification Hook
export function useVerifyOrder() {
  const [, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  const { t } = useTranslation();

  return useMutation(client.orders.verify, {
    onSuccess: (data) => {
      if (data?.errors) {
        toast.error(data.errors[0]?.message || t('error-verification-failed'));
      } else if (data) {
        setVerifiedResponse(data);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('error-verification-failed'));
    },
  });
}

// Order Payment Hook
export function useOrderPayment() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate: createOrderPayment, isLoading } = useMutation(
    client.orders.payment,
    {
      onSuccess: () => {
        toast.success(t('payment-successful'));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS_DOWNLOADS);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || t('payment-failed'));
      },
    }
  );

  const formatOrderInput = (input: CreateOrderPaymentInput) => {
    createOrderPayment(input);
  };

  return {
    createOrderPayment: formatOrderInput,
    isLoading,
  };
}

// Payment Method Saving Hook
export function useSavePaymentMethod() {
  const { t } = useTranslation();

  const {
    mutate: savePaymentMethod,
    isLoading,
    error,
    data,
  } = useMutation(client.orders.savePaymentMethod, {
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('error-saving-payment-method'));
    },
  });

  return {
    savePaymentMethod,
    data,
    isLoading,
    error,
  };
}

// Payment Intent Hooks
export function useGetPaymentIntentOriginal({
  tracking_number,
}: {
  tracking_number: string;
}) {
  const router = useRouter();
  const { openModal } = useModalAction();
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery(
    [API_ENDPOINTS.PAYMENT_INTENT, { tracking_number }],
    () => client.orders.getPaymentIntent({ tracking_number }),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.[0]?.is_redirect && data?.[0]?.redirect_url) {
          return router.push(data[0].redirect_url);
        }
        openModal('PAYMENT_MODAL', {
          paymentGateway: data?.payment_gateway,
          paymentIntentInfo: data?.[0],
          trackingNumber: data?.tracking_number,
        });
      },
      onError: () => {
        toast.error(t('error-fetching-payment-intent'));
      },
    }
  );

  return {
    data,
    getPaymentIntentQueryOriginal: refetch,
    isLoading,
    error,
  };
}

export function useGetPaymentIntent({
  tracking_number,
  payment_gateway,
  recall_gateway,
}: {
  tracking_number: string;
  payment_gateway: string;
  recall_gateway?: boolean;
}) {
  const router = useRouter();
  const { openModal } = useModalAction();
  const { t } = useTranslation();

  const { data, isLoading, error, refetch, isFetching } = useQuery(
    [
      API_ENDPOINTS.PAYMENT_INTENT,
      { tracking_number, payment_gateway, recall_gateway },
    ],
    () => client.orders.getPaymentIntent({
      tracking_number,
      payment_gateway,
      recall_gateway,
    }),
    {
      enabled: false,
      onSuccess: (data) => {
        const paymentData = isArray(data) ? data[0] : isObject(data) ? data : null;

        if (!paymentData) {
          throw new Error('Invalid payment data received');
        }

        if (paymentData.is_redirect && paymentData.redirect_url) {
          return router.push(paymentData.redirect_url);
        }

        if (recall_gateway) {
          window.location.reload();
          return;
        }

        openModal('PAYMENT_MODAL', {
          paymentGateway: paymentData.payment_gateway,
          paymentIntentInfo: paymentData,
          trackingNumber: tracking_number,
        });
      },
      onError: () => {
        toast.error(t('error-fetching-payment-intent'));
      },
    }
  );

  return {
    data,
    getPaymentIntentQuery: refetch,
    isLoading,
    fetchAgain: isFetching,
    error,
  };
}