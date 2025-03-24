import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { permissionClient } from './client/permission';
import { useRouter } from 'next/router';

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
    onSuccess: (data) => {
      toast.success('Permission updated successfully');
    },
    onError: (error) => {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    },
  });

  const mutationPost = useMutation(permissionClient.postPermission, {
    onSuccess: (data) => {
      toast.success('Permission saved successfully');
    },
    onError: (error) => {
      console.error('Error saving permission:', error);
      toast.error('Failed to save permission');
    },
  });

  return {
    mutateUpdate: mutation.mutateAsync, // ✅ Change to mutateAsync
    mutatePost: mutationPost.mutateAsync, // ✅ Change to mutateAsync
  };
};
