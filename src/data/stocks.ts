import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { stockClient } from './client/stocks';

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
