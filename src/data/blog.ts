import { useMutation, useQuery, useQueryClient } from 'react-query';
import { blogClient } from './client/blog';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Router, useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { mapPaginatorData } from '@/utils/data-mappers';

export const useCreateBlogMutation = () => { 
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  
  return useMutation(blogClient.create, {
    onSuccess: () => {
      // Generate the redirect URL based on whether there's a shop query
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.blog.list}`
        : Routes.blog.list;

      // Correct usage of router.push
      router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      // Show a success toast notification
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after mutation is settled (success or error)
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG);
    },
  });
};


export const useUpdateBlogMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(blogClient.update, {
    onSuccess: () => {
      const generateRedirectUrl = router.query.shop
      ? `/${router.query.shop}${Routes.blog.list}`
      : Routes.blog.list;

    // Correct usage of router.push
    router.push(generateRedirectUrl, undefined, {
      locale: Config.defaultLanguage,
    });

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
export const useBlogsQuery = (
  params: {
    shopSlug: string;
    search?: string;
    language?: string;
    orderBy?: string;
    sortedBy?: string;
    page?: number;
  },
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.BLOG, params],
    ({ queryKey, pageParam }) => {
      const { shopSlug, search, language, orderBy, sortedBy, page } = queryKey[1];
 
      console.log('shopSlug being sent:', shopSlug);

      return blogClient.get({
        slug: shopSlug,   
        search,
        language,
        orderBy,
        sortedBy,
        page,
        ...pageParam,  
      });
    },
    {
      keepPreviousData: true,  
      ...options,
    }
  );

  return {
    blogs: data?.data ?? [],  
    paginatorInfo: mapPaginatorData(data),  
    error,
    loading: isLoading,
  };
};


// export const useBlogsQuery = (params: { shopSlug: string; search?: string; language?: string; orderBy?: string; sortedBy?: string; page?: number }) => {
//   return useQuery([API_ENDPOINTS.BLOG, params], () =>
//     blogClient.get({
//       slug: params.shopSlug,
//       search: params.search, // Send search term to the API
//       language: params.language,
//       orderBy: params.orderBy,
//       sortedBy: params.sortedBy,
//       page: params.page,
//       // shop_id: params.shopSlug,
//     })
//   );
// };
 
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
