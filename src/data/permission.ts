import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { permissionClient } from './client/permission';

export const usePermissionData = (userId: string) => {

  const { isLoading, error, data, refetch } = useQuery<
    {
      map(arg0: (e: any, index: any) => JSX.Element): import("react").ReactNode | Record<string, unknown>; Permission: any
    },
    Error
  >([API_ENDPOINTS.PERMISSION], async () => {
    const response = await permissionClient.getAllPermission(userId);
    return response;
  });

  return { data, isLoading, error, refetch };
};

export const useSavePermissionData = () => {
  const mutation = useMutation(permissionClient.updatePermission, {
    onSuccess: () => {
      toast.success('Permission updated successfully');
    },
    onError: () => {
      toast.error('Failed to update permission');
    },
  });

  const mutationPost = useMutation(permissionClient.postPermission, {
    onSuccess: () => {
      toast.success('Permission saved successfully');
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
