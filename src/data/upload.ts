import { useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { uploadClient } from '@/data/client/upload';

export const useUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (input: any) => {
      return uploadClient.upload(input);
    },
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
      },
    }
  );
};

export const useDeleteAttachmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (idOrKey: string) => uploadClient.delete(idOrKey),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ATTACHMENTS);
        queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
      },
      onError: (error) => {
        console.error('Failed to delete attachment:', error.response?.data || error.message);
      },
    }
  );
};
