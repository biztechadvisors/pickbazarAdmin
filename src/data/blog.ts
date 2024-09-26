import { useMutation, useQuery, useQueryClient } from 'react-query';
import { blogClient } from './client/blog';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Router, useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';

export const usecreateBlogMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(blogClient.create, {
    onSuccess: () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.blog.list}`
        : Routes.blog.list;
      Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG);
    },
  });
};

export const useUpdateBlogMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(blogClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onError: (error: any) => {
      toast.error(t('common:update-failed'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ATTRIBUTES);
    },
  });
};

export const useBlogQuery = ({ slug, language }: any) => {
  return useQuery([API_ENDPOINTS.BLOG, { slug, language }], () =>
    blogClient.get({ slug, language })
  );
};

export const useBlogsQuery = (params: any) => {
  return useQuery(
    [API_ENDPOINTS.BLOG, params],
    () => blogClient.getAll(params),
    {
      onSuccess: (data) => {
        // Handle successful data fetching (e.g., log data, set additional state)
        console.log('Blogs fetched successfully:', data);
      },
      onError: (error) => {
        // Handle errors (e.g., show an error message)
        console.error('Error fetching blogs:', error);
      },
    }
  );
};

export const useDeleteBlogMutation = (params: any) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(blogClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
      queryClient.invalidateQueries([API_ENDPOINTS.BLOG, params]);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG, params);
    },
  });
};

export const useBlogSingleData = (id: string) => {
  return useQuery([API_ENDPOINTS.BLOG, id], () => blogClient.singleData({id}), {
    enabled: !!id, // Fetch only if id exists
  });
};
