import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const blogClient = {
  create: (input: any) => {
    console.log('blog+++++++++++++++input');
    HttpClient.post<any>(API_ENDPOINTS.BLOG, input);
  },

  getAll: (params: any) => {
    console.log('Params', params);
    return HttpClient.get<any>(`${API_ENDPOINTS.BLOG}/shop/${params}`);
  },

  delete: (params: any) => {
    const { id } = params;
    return HttpClient.delete<any>(`${API_ENDPOINTS.BLOG}/${id}`);
  },
};
