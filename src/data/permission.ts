import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { permissionClient } from './client/permission';
import { useRouter } from 'next/router';

export const usePermissionData = (
  {
    search = '',
    type = '',
    page = 1,
    limit = 10,
  } = {}
) => {
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  };

  const { isLoading, error, data: response, refetch } = useQuery(
    ['permissions', getUserId(), search, type, page, limit],
    async () => {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User ID is missing');
      }
      const { data, meta } = await permissionClient.getAllPermission(userId, search, type, page, limit);
      return { data, meta };
    },
    {
      enabled: !!getUserId(),
      retry: false,
    }
  );

  return {
    data: response?.data ?? [],
    meta: response?.meta ?? {},
    isLoading,
    error,
    refetch,
  };
};


export const useSavePermissionData = () => {
  const router = useRouter();

  const mutation = useMutation(permissionClient.updatePermission, {
    onSuccess: (data) => {
      toast.success('Permission updated successfully');
      // router.push('/permission');
    },
    onError: (error) => {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    },
  });

  const mutationPost = useMutation(permissionClient.postPermission, {
    onSuccess: (data) => {
      toast.success('Permission saved successfully');
      // router.push('/permission');

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
