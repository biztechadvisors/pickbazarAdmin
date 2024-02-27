import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { permissionClient } from './client/permission';

export const usePermissionData = () => {
  const { isLoading, error, data, refetch } = useQuery<{ Permission: any }, Error>(
    [API_ENDPOINTS.PERMISSION],
    async () => {
      const response = await permissionClient.getAllPermission();
      return response;
    }
  );

  return { isLoading, error, data, refetch };
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
