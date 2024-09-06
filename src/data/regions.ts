import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { couponClient } from './client/coupon';
import { Coupon, CouponPaginator, CouponQueryOptions, RegionPaginator, RegionsQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { regionClient } from './client/region';

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(couponClient.create, {
    onSuccess: () => {
      Router.push(Routes.coupon.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError: (error: any) => {
      const {data, status} =  error?.response;
      if (status === 422) {
        const errorMessage:any = Object.values(data).flat();
        toast.error(errorMessage[0]);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};

// export const useDeleteCouponMutation = () => {
//   const queryClient = useQueryClient();
//   const { t } = useTranslation();

//   return useMutation(couponClient.delete, {
//     onSuccess: () => {
//       toast.success(t('common:successfully-deleted'));
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
//     },
//   });
// };

// export const useUpdateCouponMutation = () => {
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();
//   const { locale } = useRouter();
//   return useMutation(couponClient.update, {
//     onSuccess: async (data) => {
//       toast.success(t('common:successfully-updated'));
//       await Router.replace(
//         `${Routes.coupon.list}/${data?.code}/edit`,
//         undefined,
//         {
//           locale,
//         }
//       );
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
//     },
//   });
// };

// export const useVerifyCouponMutation = () => {
//   return useMutation(couponClient.verify);
// };

// export const useCouponQuery = ({
//   code,
//   language,
// }: {
//   code: string;
//   language: string;
// }) => {
//   const { data, error, isLoading } = useQuery<Coupon, Error>(
//     [API_ENDPOINTS.COUPONS, { code, language }],
//     () => couponClient.get({ code, language })
//   );

//   return {
//     coupon: data,
//     error,
//     loading: isLoading,
//   };
// };


export const useRegionsQuery = (
  params: Partial<RegionsQueryOptions>,
  options: any = {}
) => {
  // useQuery to fetch data
  const { data, error, isLoading } = useQuery<RegionPaginator, Error>(
    [API_ENDPOINTS.REGIONS, params],
    ({ queryKey }) =>
      regionClient.get({ shopSlug: queryKey[1].shopSlug }), // Pass shopSlug correctly
    {
      keepPreviousData: true,
      ...options,
    }
  );

  // Return the data in a more structured way
  return {
    regions: data?.data ?? [], // Return regions instead of orders
    paginatorInfo: data ? mapPaginatorData(data) : null, // Handle paginator info correctly
    error,
    loading: isLoading,
  };
};



// export const useRegionsQuery = (options: Partial<RegionsQueryOptions>) => {
//   const { data, error, isLoading } = useQuery<RegionPaginator, Error>(
//     [API_ENDPOINTS.REGIONS, options],
//     ({ queryKey, pageParam }) =>
//       regionClient.paginated(Object.assign({}, queryKey[1], pageParam)),
//     {
//       keepPreviousData: true,
//     }
//   );

//   return {
//     regions: data?.data ?? [],
//     paginatorInfo: mapPaginatorData(data),
//     error,
//     loading: isLoading,
//   };
// };
