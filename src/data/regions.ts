import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Region, RegionPaginator, RegionsQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { regionClient } from './client/region';
 
export const useDeleteRegionsClassMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
 
  return useMutation(regionClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGIONS);
    },
  });
};
 
export const useCreateRegionsClassMutation = (shop_id) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
 
  return useMutation((data) => regionClient.create({ ...data, shop_id }), {
    onSuccess: () => {
      router.push(Routes.regions.list);
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGIONS);
    },
  });
};
 
export const useRegionsQuery = (
  params: Partial<RegionsQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<RegionPaginator, Error>(
    [API_ENDPOINTS.REGIONS, params],
    ({ queryKey, pageParam }) =>
      regionClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );
  console.log("first-data", data)
  return {
    regions: data || [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
 
export const useUpdateRegionClassMutation = (shop_id) => {
  console.log('shop_id =', shop_id)
  const { t } = useTranslation();
  const queryClient = useQueryClient();
 
  return useMutation((data) => regionClient.update({ ...data , shop_id }), {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGIONS);
    },
  });
};
 
 
 
export const useRegionsingleDataQuery = (id: string) => {
  return useQuery<Region, Error>([API_ENDPOINTS.REGIONS, id], () =>
    regionClient.get({ id })
  );
};