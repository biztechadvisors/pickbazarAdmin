import { API_ENDPOINTS } from "./api-endpoints";
import { HttpClient } from "./http-client";

export const cartsClient = { 
    updateCartApi: (cartData: any) => {
      return HttpClient.post<any>(`${API_ENDPOINTS.CART}`, cartData);
    },
};
