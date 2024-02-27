import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const permissionClient = { 
  getAllPermission: () => {
    return HttpClient.get<any>(`${API_ENDPOINTS.PERMISSION}`);
  },
  getAllPermissionById: (permissionId) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.PERMISSION}/${permissionId}`);
  },
};

