import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { permissionClient } from './client/permission';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';

// export const usePermissionData = (userId: string) => {

//   const { isLoading, error, data, refetch } = useQuery<
//     {
//       map(arg0: (e: any, index: any) => JSX.Element): import("react").ReactNode | Record<string, unknown>; Permission: any
//     },
//     Error
//   >([API_ENDPOINTS.PERMISSION], async () => {
//     const response = await permissionClient.getAllPermission(userId);
//     return response;
//   });
//   return { data, isLoading, error, refetch };
// };

export const usePermissionData = () => {
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  };
  const { isLoading, error, data, refetch } = useQuery(
    // ['permissions', localStorage.getItem('userId')], // Key includes userId for better caching
    ['permissions', getUserId()],
    async () => {
      // const userId = localStorage.getItem('userId');
      const userId = getUserId();
      if (!userId) {
        throw new Error('User ID is missing');
      }
      const response = await permissionClient.getAllPermission(userId);
      return response;
    },
    {
      // enabled: !!localStorage.getItem('userId'),  
      enabled: !!getUserId(),
      retry: false, // Optional: prevent retry on missing userId
    }
  );

  return { data, isLoading, error, refetch };
};
export const useSavePermissionData = () => {
  const router = useRouter();
  const mutation = useMutation(permissionClient.updatePermission, {
    onSuccess: () => {
      // router.push('/permission'); 
      toast.success('Permission updated successfully');
    },
    onError: () => {
      toast.error('Failed to update permission');
    },
  });

  const mutationPost = useMutation(permissionClient.postPermission, {
    onSuccess: () => {
      // router.push('/permission').then(() => {
      toast.success('Permission saved successfully'); // Show success toast after navigation
      // });
    },
    onError: () => {
      toast.error('Failed to save permission');
    },
  });

  return {
    mutateUpdate: mutation.mutate,
    mutatePost: mutationPost.mutate,
  };
};
