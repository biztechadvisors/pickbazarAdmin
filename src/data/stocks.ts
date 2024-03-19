import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { stockClient } from './client/stocks';
import { Order, OrderPaginator, OrderQueryOptions } from '@/types';
import { orderClient } from './client/order';
import { mapPaginatorData } from '@/utils/data-mappers';

export const useGetStock = (id: any) => {
  return useQuery<any, Error>([API_ENDPOINTS.STOCK, id], async () => {
    try {
      const response = await stockClient.getById(id);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  });
};

export const useOrdersSalesQuery = (
  params: Partial<OrderQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.STOCK, params],
    ({ queryKey, pageParam }) =>
      stockClient.paginated(Object.assign({}, queryKey[1], pageParam)),
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

export const useOrderSaleQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Order, Error>(
    [API_ENDPOINTS.STOCK, { id, language }],
    () => stockClient.get({ id, language })
  );

  return {
    order: data,
    error,
    isLoading,
  };
};

export const useOrderSalesQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Order, Error>(
    [API_ENDPOINTS.STOCKBYID, { id, language }],
    () => stockClient.get({ id, language })
  );

  return {
    order: data,
    error,
    isLoading,
  };
};
