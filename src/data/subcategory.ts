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
import { useState } from 'react';
import { useEffect } from 'react';

export const getShopSlug = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('shopSlug') || '';
  }
  return '';
};
export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(subcategoryClient.create, {
    onSuccess: () => {
      queryClient.invalidateQueries([API_ENDPOINTS.SUBCATEGORIES, getShopSlug()]);
      Router.push(`/${getShopSlug()}/${Routes.subcategory.list}`, undefined, {
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
      queryClient.invalidateQueries([API_ENDPOINTS.SUBCATEGORIES, getShopSlug()]);
      Router.push(`/${getShopSlug()}/${Routes.subcategory.list}`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBCATEGORIES);
    },
  });
};

export const useSubCategoryQuery = ({ slug, language }: GetParams) => {
  const [shopSlug, setShopSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSlug = localStorage.getItem('shopSlug');
      setShopSlug(storedSlug);
    }
  }, []);

  const { data, error, isLoading } = useQuery<SubCategory, Error>(
    [API_ENDPOINTS.SUBCATEGORIES, slug, language, shopSlug],
    () => subcategoryClient.getSubCategory({ slug, language, shopSlug }),
    {
      enabled: !!shopSlug,
    }
  );

  return {
    subcategory: data ?? [],
    error,
    isLoading,
  };
};

export const useSubCategoriesQuery = (
  options: Partial<SubCategoryQueryOptions>
) => {
  const [shopSlug, setShopSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSlug = localStorage.getItem('shopSlug');
      setShopSlug(storedSlug);
    }
  }, []);

  const queryOptions = { ...options, shopSlug };

  const { data, error, isLoading } = useQuery<SubCategoryPaginator, Error>(
    [API_ENDPOINTS.SUBCATEGORIES, queryOptions],
    ({ queryKey, pageParam }) =>
      subcategoryClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      enabled: !!shopSlug, // Ensures the query runs only when shopSlug is set
      onSuccess: (data) => {
        console.log("Subcategories fetched: ", data); // Log the response
      },
    }
  );

  return {
    subcategories: data?.data ?? [], 
  paginatorInfo: mapPaginatorData(data),
  error,
  loading: isLoading,
  };
};