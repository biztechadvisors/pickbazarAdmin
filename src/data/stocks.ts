import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { stockClient } from './client/stocks';
import { Order, OrderPaginator, OrderQueryOptions } from '@/types';
import { orderClient } from './client/order';
import { mapPaginatorData } from '@/utils/data-mappers';
import { toast } from 'react-toastify';

// export const useGetStock = (id: any) => {
//   return useQuery<any, Error>([API_ENDPOINTS.STOCK, id], async () => {
//     try {
//       const response = await stockClient.getById(id);
//       return response;
      
//     } catch (error) {
//       throw new Error(error.message);
//     }
    
//   });
// };





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

export const useDealerStocks = (id: any) => {
  return useQuery(['dealerStockList', id], async () => {
    try {
      const data = await stockClient.fetchDealerStockData(id);
      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
};

export const useDealerByIdStocks = (id: any) => {
  return useQuery(['dealerStockList', id], async () => {
    try {
      const data = await stockClient.fetchDealerStockDataById(id);
      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
};

export const useUpdateStockData = (user_id: any) => {
  const mutation = useMutation(
    (updatedData: any) => stockClient.updateStockData(user_id, updatedData),
    {
      onSuccess: () => {
        toast.success('Stock data updated successfully');
      },
      onError: () => {
        toast.error('Failed to update stock data');
      },
    }
  );

  return mutation;
};

export interface StockIdS {
  dealerId: number;
  orderId: string;
}
export const useFetchStockOrderData = ({ dealerId, orderId }: StockIdS) => {
  return useQuery([API_ENDPOINTS.STOCK, dealerId, orderId], async () => {
    try {
      const data = await stockClient.getStockByOrderId({ dealerId, orderId });
      return data;
    } catch (error) {
      console.log(error);
    }
  });
};

export const useUpdateStockDataById = (user_id: any) => {
  const queryClient = useQueryClient();
  console.log("queryClient",queryClient)

  return useMutation(
    (updatedData: any) => stockClient.updateStockDataById(user_id, updatedData),
    {
      onSuccess: () => {
        toast.success('Stock data updated successfully');
        queryClient.invalidateQueries([API_ENDPOINTS.STOCK]);
      },
      onError: () => {
        toast.error('Failed to update stock data');
      },
    }
  );
};

export const useUpdateStockDataByDealer = (user_id: any) => {
  const queryClient = useQueryClient();

  return useMutation(
    (updatedData: any) => stockClient.updateStockDataByDealer(user_id, updatedData),
    {
      onSuccess: () => {
        toast.success('Stock data updated successfully');
        queryClient.invalidateQueries([API_ENDPOINTS.STOCK_DEALER_UPDATE]);
      },
      onError: () => {
        toast.error('Failed to update stock data');
      },
    }
  );
};
// export const useUpdateStockDataByDealer = (user_id: any) => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (updatedData: any) => {
//       console.log('updatedData', updatedData); // Log the updatedData
//       return stockClient.updateStockDataByDealer(user_id, updatedData);
//     },
//     {
//       onSuccess: () => {
//         toast.success('Stock data updated successfully');
//         queryClient.invalidateQueries([API_ENDPOINTS.STOCK_DEALER_UPDATE]);
//       },
//       onError: () => {
//         toast.error('Failed to update stock data');
//       },
//     }
//   );
// };

