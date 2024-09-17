import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const blogClient = {
  create: (input: any) => {
    console.log('blog+++++++++++++++input', input);
    HttpClient.post<any>(API_ENDPOINTS.BLOG, input);
  },

  get({ slug, language }: any) {
    return HttpClient.get(`${API_ENDPOINTS.BLOG}/shop/${slug}`, { language });
  },

  getAll: ({ shopSlug, ...params }: any) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.BLOG}/shop/${shopSlug}`);
  },

  update: ({ id, ...input }: any) => {
    return HttpClient.put(`${API_ENDPOINTS.BLOG}/${id}`, input);
  },

  singleData: ({ id }: any) => {
    return HttpClient.get(`${API_ENDPOINTS.BLOG}/${id}`);
  },

  delete: (params: any) => {
    const { id } = params;
    return HttpClient.delete<any>(`${API_ENDPOINTS.BLOG}/${id}`);
  },
};
