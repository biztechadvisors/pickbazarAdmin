import { AddDealerInput, DealerPaginator, DealerQueryOptions, GetParams } from '@/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';
import { dealerClient } from './client/dealer';

export const useDealerQuery = (
  params: Partial<DealerQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<DealerPaginator, Error>(
    [API_ENDPOINTS.DEALER, params],
    ({ queryKey, pageParam }) =>
      dealerClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );
  return {
    dealer: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useAddDealerMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  
  return useMutation(dealerClient.addDealer, {
    onSuccess: () => {
    //   router.push(`/${router?.query?.shop}${Routes.dealerlist.list}`);
      router.push(`${Routes.dealerlist.list}`);
      toast.success(t('common:successfully-created'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DEALER);
    },
  });
};

export const useDealerQueryGet = ({ id }: any) => {
  return useQuery<{ AddDealerInput: any }, Error>(
    [API_ENDPOINTS.DEALER, id],
    async () => {
      const response = await dealerClient.getDealer({ id });
      return response
    }
  );
};

  export const useDeleteDealerMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    return useMutation(dealerClient.removeDealer, {
      onSuccess: () => {
        toast.success(t('common:successfully-deleted'));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.DEALER);
      },
    });
  };

export const useUpdateDealerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(dealerClient.updateDealer, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DEALER);
    },
  });
};
