import Router, { useRouter }  from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import { TagQueryOptions, GetParams, TagPaginator, Tag, Region } from '@/types';
import { tagClient } from '@/data/client/tag';
import { Config } from '@/config';
import { regionClient } from './client/regions';

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(tagClient.create, {
    onSuccess: async () => {
      // Router.push(Routes.tag.list, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.tag.list}`
        : Routes.product.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(tagClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
    },
  });
};

export const useUpdateTagMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const router = useRouter();
  return useMutation(tagClient.update, {
    onSuccess: async() => {
      const generateRedirectUrl = router.query.shop
      ? `/${router.query.shop}${Routes.tag.list}`
      : Routes.product.list;
    await Router.push(generateRedirectUrl, undefined, {
      locale: Config.defaultLanguage,
    });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
    },
  });
};

export const useTagQuery = ({ slug, language }: GetParams) => {
  console.log('tag slug', slug);
  const { data, error, isLoading } = useQuery<Tag, Error>(
    [API_ENDPOINTS.TAGS, { slug, language }],
    () => tagClient.get({ slug, language })
  );
  console.log('Tag data', data);
  return {
    tag: data,
    error,
    loading: isLoading,
  };
};
// export const useRegionsQuery = ({ shopSlug, language }: GetParams) => {
//   const { data, error, isLoading } = useQuery<Region[], Error>(
//     [API_ENDPOINTS.REGIONS, { shopSlug, language }],
//     () => regionClient.get({ shopSlug, language })
//   );

//   console.log("REGION DATA: ", data);
//    return {
//     regions: data,
//     error,
//     loading: isLoading,
//   };
// };

export const useTagsQuery = (
  params: Partial<TagQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<TagPaginator, Error>(
    [API_ENDPOINTS.TAGS, params],
    ({ queryKey, pageParam }) =>
      tagClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  console.log('dfata= ===', data);

  return {
    tags: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
