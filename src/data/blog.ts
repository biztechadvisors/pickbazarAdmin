import { useMutation, useQuery, useQueryClient } from 'react-query';
import { blogClient } from './client/blog';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';

export const usecreateBlogMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(blogClient.create, {
    onSuccess: async () => {
      toast.success(t('common:successfully-created'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};


export const useBlogsQuery = (params: any) => {
    return useQuery(['blogs', params], () => blogClient.getAll(params), {
      onSuccess: (data) => {
        // Handle successful data fetching (e.g., log data, set additional state)
        console.log('Blogs fetched successfully:', data);
      },
      onError: (error) => {
        // Handle errors (e.g., show an error message)
        console.error('Error fetching blogs:', error);
      },
    });
  };