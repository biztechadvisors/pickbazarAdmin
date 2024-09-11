import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { couponClient } from './client/coupon';
import { Coupon, CouponPaginator, CouponQueryOptions, Faq, FaqPaginator, FaqQueryOptions, Region, RegionPaginator, RegionsQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { faqClient } from './client/faq';

export const useCreateFaqClassMutation = (shop_id) => {
// const shopId = shop_id
  console.log('faqShopID = ', shop_id)
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation((data) => faqClient.create({ ...data, shop_id }), {
    onSuccess: () => {
      router.push(Routes.faq.list);
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FAQ);
    },
  });
};


export const useFaqQuery = (
  params: Partial<FaqQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<FaqPaginator, Error>(
    [API_ENDPOINTS.FAQ, params],
    ({ queryKey, pageParam }) =>
      faqClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );
  console.log('datafaq = ',data)
  return {
    faq: data || [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useUpdateFaqClassMutation = (shop_id) => {
  console.log('shop_id =', shop_id)
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation((data) => faqClient.update({ ...data , shop_id }), {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FAQ);
    },
  });
};

export const useDeleteFaqClassMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(faqClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FAQ);
    },
  });
};

export const useFaqsingleDataQuery = (id: string) => {
  console.log('id = ',id)
  return useQuery<Faq, Error>([API_ENDPOINTS.FAQ, id], () =>
    faqClient.get({ id })
  );
};
