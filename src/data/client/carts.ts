import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const cartsClient = {
  updateCartApi: (items, customerId, email, phone) => {
    return HttpClient.post<any>(`${API_ENDPOINTS.CART}`, {
      customerId,
      email,
      phone,
      cartData: items,
    });
  },
};
