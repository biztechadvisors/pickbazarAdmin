import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { cartClient } from "./client/carts";

export const useCartsMutation = () => {
    const queryClient = useQueryClient();
    // const { t } = useTranslation();
    
    return useMutation(cartClient.create, {
      onSuccess: () => {
        // toast.success('Cart Updated');
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CARTS);
      },
    });
  };