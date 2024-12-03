import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { careersClient } from './client/careers'; // Updated to use careersClient
import { Career, CareerPaginator, CareerQueryOptions } from '@/types'; // Updated types for careers
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';

// Create Career Entry
export const useCreateCareerMutation = (shop_id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation((data) => careersClient.create({ ...data, shop_id }), {
    // Changed to careersClient
    onSuccess: () => {
      router.push(Routes.careers.list); // Updated route for careers
      toast.success(t('common:successfully-created'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CAREERS); // Updated endpoint for careers
    },
  });
};

// Query Career List
export const useCareersQuery = (
  params: Partial<CareerQueryOptions>, // Should contain shopSlug
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<CareerPaginator, Error>(
    [API_ENDPOINTS.CAREERS, params], // This key will now include params, including shopSlug
    ({ queryKey, pageParam }) => {
      // Merge params with page parameters for pagination
      const { shopSlug, ...restParams } = queryKey[1]; // Extract shopSlug from params
      return careersClient.paginated({
        ...restParams,
        shopSlug, // Ensure shopSlug is sent in the API call
        pageParam, // Include pagination details if needed
      });
    },
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    careers: data || [], // This returns the careers data
    paginatorInfo: mapPaginatorData(data), // Process pagination info
    error,
    loading: isLoading,
  };
};

// Update Career Entry
export const useUpdateCareerMutation = (shop_id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation((data) => careersClient.update({ ...data, shop_id }), {
    // Changed to careersClient
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CAREERS); // Updated endpoint
    },
  });
};

// Delete Career Entry
export const useDeleteCareerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(careersClient.delete, {
    // Changed to careersClient
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CAREERS); // Updated endpoint
    },
  });
};

// Query single Career Entry
export const useCareerSingleDataQuery = (id: string) => {
  return useQuery<Career, Error>(
    [API_ENDPOINTS.CAREERS, id],
    () =>
      // Changed to Career
      careersClient.get({ id }) // Changed to careersClient
  );
};
