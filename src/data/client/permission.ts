import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const permissionClient = {
  getAllPermission: () => {
    return HttpClient.get<any>(`${API_ENDPOINTS.PERMISSION}`);
  },
  getPermissionById: (permissionId: any) => {
    return HttpClient.get(`${API_ENDPOINTS.PERMISSION}/${permissionId}`);
  },
  updatePermission: (params: any) => {
    // console.log("params", params)
    const { permissionId, dataToSend } = params;
    return HttpClient.put(
      `${API_ENDPOINTS.PERMISSION}/${permissionId}`,
      dataToSend
    );
  },
  postPermission: (data: any) => {
    console.log("Data***Post", data)
    return HttpClient.post(`${API_ENDPOINTS.PERMISSION}`, data);
  },
};
