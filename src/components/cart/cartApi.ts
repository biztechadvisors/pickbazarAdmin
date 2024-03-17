import axios from 'axios';

interface CustomerData {
    customerId: number;
    email: string;
    phone: string;
    cartData: any;
  }

export const addItemToCartApi = async (customerData: CustomerData): Promise<any> => {
  try {
    // Make a POST request to the API endpoint
    const response = await axios.post('http://localhost:5000/api/carts', customerData);
    // Return the response data
    return response.data;
  } catch (error) {
    // Throw an error if the request fails
    throw new Error('Failed to add item to the cart');
  }
};
