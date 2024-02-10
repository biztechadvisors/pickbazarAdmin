// import {
//   Permission,
    
//   } from '@/types';
//   import { API_ENDPOINTS } from './api-endpoints';
//   import { crudFactory } from './curd-factory';
//   import { HttpClient } from './http-client';
  
//   export const ViewPermission = {
  
//     get: ({ id, language }: { id: string; language: string }) => {
//       return HttpClient.get<Permission>(`${API_ENDPOINTS.PERMISSION}`, {
//         language,
//       });
//     },
    
//   };
  
import { Permission } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const ViewPermission = {
  getAll: ({ language }: { language: string }) => {
    // Assuming API_ENDPOINTS.PERMISSION includes the base endpoint for fetching all permissions
    const endpoint = `${API_ENDPOINTS.PERMISSION}`;

    // Make the GET request to fetch all permission data
    return HttpClient.get<Permission[]>(endpoint, {
      params: { language }, // Assuming you want to pass the language as a query parameter
    });
  },
};


