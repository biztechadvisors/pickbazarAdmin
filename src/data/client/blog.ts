import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const blogClient = {
  create: (input: any) => {
    console.log('blog+++++++++++++++input', input);
    return HttpClient.post<any>(API_ENDPOINTS.BLOG, input);
  },

  // get({ slug, language }: any) {
  //   return HttpClient.get(`${API_ENDPOINTS.BLOG}/shop/${slug}`, { language });
  // },
  
  get({ slug, language, search, shop_id }: { slug: string; language?: string; search?: string; shop_id?: number }) {
    // Create query parameters
    const queryParams = new URLSearchParams();
    if (language) queryParams.append('language', language);
    if (search) queryParams.append('search', search); // Add search query
    if (shop_id) queryParams.append('shop_id', shop_id.toString());

    // Build final URL
    const url = `${API_ENDPOINTS.BLOG}/shop/${slug}?${queryParams.toString()}`;

    // Make the API call with query parameters
    return HttpClient.get(url);
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
