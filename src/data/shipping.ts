import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { useTranslation } from 'next-i18next';
import { ShippingUpdateInput } from '@/types';
import { toast } from 'react-toastify';
import { Shipping } from '@/types';
import { ShippingQueryOptions } from '@/types';
import { shippingClient } from './client/shipping';

export const useCreateShippingMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(shippingClient.create, {
    onSuccess: () => {
      router.push(Routes.shipping.list);
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
    },
    onError: (error: any) => {
      const { data, status } = error?.response;
      if (status === 422) {
        const errorMessage: any = Object.values(data).flat();
        toast.error(errorMessage[0]);
      } else {
        toast.error(t(`common:${error?.response?.data.message}`));
      }
    },
  });
};

export const useDeleteShippingClassMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(shippingClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
    },
  });
};

export const useUpdateShippingMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(shippingClient.update, {
    onSuccess: () => {
      router.push(Routes.shipping.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
    },
  });
};

export const useShippingQuery = (id: string) => {
  return useQuery<Shipping, Error>([API_ENDPOINTS.SHIPPINGS, id], () =>
    shippingClient.get({ id })
  );
};

export const useShippingClassesQuery = (
  options: Partial<ShippingQueryOptions> = {}
) => {
  const { data, error, isLoading } = useQuery<Shipping[], Error>(
    [API_ENDPOINTS.SHIPPINGS, options],
    ({ queryKey, pageParam }) =>
      shippingClient.all(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    shippingClasses: data ?? [],
    error,
    loading: isLoading,
  };
};
