import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const permissionClient = {
  // permissionClient.ts
  getAllPermission: (
    userId: string,
    search?: string,
    type?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (type) queryParams.append('type', type);
    queryParams.append('userId', userId);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return HttpClient.get<any>(`${API_ENDPOINTS.PERMISSION}?${queryParams.toString()}`);
  },

  getPermissionById: (permissionId: any) => {
    return HttpClient.get(`${API_ENDPOINTS.PERMISSION}/${permissionId}`);
  },
  updatePermission: (params: any) => {
    const { permissionId, dataToSend } = params;
    return HttpClient.put(
      `${API_ENDPOINTS.PERMISSION}/${permissionId}`,
      dataToSend
    );
  },
  postPermission: (data: any) => {
    return HttpClient.post(`${API_ENDPOINTS.PERMISSION}`, data);
  },
};
