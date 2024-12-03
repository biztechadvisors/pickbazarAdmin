import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { getInspiredClient } from './client/get-inspired'; // Updated to use getInspiredClient
import {
  GetInspired,
  GetInspiredPaginator,
  GetInspiredQueryOptions,
} from '@/types'; // Updated types
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';

// Create GetInspired Entry
export const useCreateGetInspiredMutation = (shop_id) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  console.log('ashasfahvsgf', shop_id);

  return useMutation((data) => getInspiredClient.create({ ...data, shop_id }), {
    // Changed to getInspiredClient
    onSuccess: () => {
      router.push(Routes.getInspired.list); // Updated route for getInspired
      toast.success(t('common:successfully-created'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_INSPIRED); // Updated endpoint for getInspired
    },
  });
};

// Query GetInspired List
export const useGetInspiredQuery = (
  params: Partial<GetInspiredQueryOptions>, // Changed type to GetInspiredQueryOptions
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<GetInspiredPaginator, Error>( // Changed to GetInspiredPaginator
    [API_ENDPOINTS.GET_INSPIRED, params], // Updated endpoint
    ({ queryKey, pageParam }) =>
      getInspiredClient.paginated(Object.assign({}, queryKey[1], pageParam)), // Changed to getInspiredClient
    {
      keepPreviousData: true,
      ...options,
    }
  );
  return {
    getInspired: data || [], // Updated to getInspired
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// Update GetInspired Entry
export const useUpdateGetInspiredMutation = (shop_id) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation((data) => getInspiredClient.update({ ...data, shop_id }), {
    // Changed to getInspiredClient
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_INSPIRED); // Updated endpoint
    },
  });
};

// Delete GetInspired Entry
export const useDeleteGetInspiredMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(getInspiredClient.delete, {
    // Changed to getInspiredClient
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_INSPIRED); // Updated endpoint
    },
  });
};

// Query single GetInspired Entry
export const useGetInspiredSingleDataQuery = (id: string) => {
  return useQuery<GetInspired, Error>(
    [API_ENDPOINTS.GET_INSPIRED, id],
    () =>
      // Changed to GetInspired
      getInspiredClient.get({ id }) // Changed to getInspiredClient
  );
};
