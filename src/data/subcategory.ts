import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  SubCategory,
  SubCategoryPaginator,
  SubCategoryQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { subcategoryClient } from './client/subcategory';
import { Config } from '@/config';

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(subcategoryClient.create, {
    onSuccess: () => {
      Router.push(Routes.subcategory.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBCATEGORIES);
    },
  });
};

export const useDeleteSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(subcategoryClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBCATEGORIES);
    },
  });
};

export const useUpdateSubCategoryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(subcategoryClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBCATEGORIES);
    },
  });
};

export const useSubCategoryQuery = ({  slug, language, userId, categoryId }: GetParams) => {
  const { data, error, isLoading } = useQuery<SubCategory, Error>(
    [API_ENDPOINTS.SUBCATEGORIES, { slug, language, categoryId, userId }],
    () => subcategoryClient.get({ slug, language, categoryId, userId })
  );
  return {
    subcategory: data,
    error,
    isLoading,
  };
};

// export const useSubCategoriesQuery = (options: Partial<SubCategoryQueryOptions>) => {
//   const { data, error, isLoading } = useQuery<SubCategoryPaginator, Error>(
//     [API_ENDPOINTS.SUBCATEGORIES, options],
//     ({ queryKey, pageParam }) =>
//       subcategoryClient.paginated(Object.assign({}, queryKey[1], pageParam)),
//     {
//       keepPreviousData: true,
//     }
//   );
//   console.log("Subcategories DATA:", data?.data);
//   return {
//     subcategories: data?.data ?? [],
//     paginatorInfo: mapPaginatorData(data),
//     error,
//     loading: isLoading,
//   };
// };

export const useSubCategoriesQuery = (options: Partial<SubCategoryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<SubCategoryPaginator, Error>(
    [API_ENDPOINTS.SUBCATEGORIES, options],
    ({ queryKey, pageParam }) =>
      subcategoryClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return {
      subcategories: [],
      paginatorInfo: null,
      error: null,
      loading: true,
    };
  }

  if (error) {
    console.error("Error fetching subcategories:", error);
    return {
      subcategories: [],
      paginatorInfo: null,
      error: error,
      loading: false,
    };
  }

  console.log("Subcategories DATA:", data?.data);
  return {
    subcategories: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error: null,
    loading: false,
  };
};
