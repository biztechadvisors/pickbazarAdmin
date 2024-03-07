import { useQuery } from "react-query";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { stockClient } from "./client/stock";

export const useGetStock = (id:any) => {
    return useQuery< any , Error>(
      [API_ENDPOINTS.STOCK],
      async () => {
        const response = await stockClient.getbyId(id);
        return response
      }
    );
  };


