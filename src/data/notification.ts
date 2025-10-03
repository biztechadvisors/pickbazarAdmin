import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { mapPaginatorData } from '@/utils/data-mappers';
import {  
  NotificationQueryOptions,
  NotificationPaginator,
} from '@/types';
import { orderClient, orderStocks } from './client/order';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { HttpClient } from './client/http-client';
import { Notification } from './client/notification';

export const useNotificationQuery = (
  params: Partial<NotificationQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<NotificationPaginator, Error>(
    [API_ENDPOINTS.NOTIFICATION, params],
    ({ queryKey, pageParam }) =>

        console.log('queryKey',queryKey, pageParam ),
    //   Notification.patch(queryKey[1] as { notificationId: number; language: string }),  // Ensure the correct object is passed
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    notifications1: data,
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};


// export const useNotificationQuery = (
//   params: Partial<NotificationQueryOptions>,
//   options: any = {}
// ) => {
//   const { data, error, isLoading } = useQuery<NotificationPaginator, Error>(
//     [API_ENDPOINTS.NOTIFICATION, params],
//     ({ queryKey, pageParam }) =>
//         Notification.post(Object.assign({}, queryKey[1], pageParam)),
//     {
//       keepPreviousData: true,
//       ...options,
//     }
//   );
//   return {
//     orders: data?.data ?? [],
//     paginatorInfo: mapPaginatorData(data),
//     error,
//     loading: isLoading,
//   };
// };