import {
   
    QueryOptions,    
    Notification    
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { crudFactory } from './curd-factory';
  import { HttpClient } from './http-client';


  export const Notification = {
    ...crudFactory<Notification, QueryOptions>(API_ENDPOINTS.NOTIFICATION),
  
    patch: ({ notificationId, language }: { notificationId: number; language: string }) => {
      return HttpClient.Patch<Notification>(`${API_ENDPOINTS.NOTIFICATION}/seen/${notificationId}`, {
        language,
      });
    },
};
