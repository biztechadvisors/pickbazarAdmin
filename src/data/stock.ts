import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { stockClient } from "./client/stock";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const useGetStock = (id: any) => {
  return useQuery<any, Error>(
    [API_ENDPOINTS.STOCK],
    async () => {
      const response = await stockClient.getById(id);
      return response
    }
  );
};

export const useGetStockSeals = (customer_id: any) => {
  return useQuery<any, Error>(
    [API_ENDPOINTS.DEALER_SEALS_STOCK, customer_id],
    async () => {
      const response = await stockClient.getByCustomer_id(customer_id);
      return response
    }
  );
};




export const useUpdateStockQuantity = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation(stockClient.updateQuantity, {
    onSuccess: () => {
      toast.success(t('Stock Quantity Updated'));
    },
    // Always refetch after error or success:
    onSettled: (data) => {
      queryClient.refetchQueries(API_ENDPOINTS.STOCK);
      data;
    },
  });
};



