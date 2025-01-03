import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { productClient } from './client/product';
import {
  ProductQueryOptions,
  GetParams,
  ProductPaginator,
  Product,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Routes } from '@/config/routes';
import { Config } from '@/config';

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  return useMutation(productClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.product.list}`
        : Routes.product.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
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

export const useUpdateProductMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(productClient.update, {
    onSuccess: async (data) => {
      // const generateRedirectUrl = router.query.shop
      //   ? `/${router.query.shop}${Routes.product.list}`
      //   : Routes.product.list;
      // await router.push(
      //   `${generateRedirectUrl}/${data?.slug}/edit`,
      //   undefined,
      //   {
      //     locale: Config.defaultLanguage,
      //   }
      // );
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.product.list}`
        : Routes.product.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// export const useUpdateQuantity = () => {
//   const queryClient = useQueryClient();
//   const { t } = useTranslation('common');
//   return useMutation(productClient.updateQuantity, {
//     onSuccess: () => {
//       toast.success(t('Quantity Updated'));
//     },
//     // Always refetch after error or success:
//     onSettled: (data) => {
//       queryClient.refetchQueries(API_ENDPOINTS.GENERATE_DESCRIPTION);
//       data;
//     },
//   });
// };

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(productClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useProductQuery = ({
  slug,
  id,
  language,
  shop_id,
}: GetParams) => {
  const { data, error, isLoading } = useQuery<Product, Error>(
    [API_ENDPOINTS.PRODUCTS, { slug, id, language, shop_id }],
    () => productClient.get({ slug, id, language, shop_id })
  );
   
  return {
    product: data ?? [],
    error,
    isLoading,
  };
};

export const useProductsQuery = (
  params: Partial<ProductQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, params],
    ({ queryKey, pageParam }) =>
      productClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );
 
  return {
    products: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useGenerateDescriptionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation(productClient.generateDescription, {
    onSuccess: () => {
      toast.success(t('Generated...'));
    },
    // Always refetch after error or success:
    onSettled: (data) => {
      queryClient.refetchQueries(API_ENDPOINTS.GENERATE_DESCRIPTION);
      data;
    },
  });
};

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const router = useRouter();
  return useMutation(productClient.updateQuantity, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
      ? `/${router.query.shop}${Routes.product.list}`
      : Routes.product.list;
    await Router.push(generateRedirectUrl, undefined, {
      locale: Config.defaultLanguage,
    });
      toast.success(t('Quantity Updated'));
    },
    // Always refetch after error or success:
    onSettled: (data) => {
      queryClient.refetchQueries(API_ENDPOINTS.GENERATE_DESCRIPTION);
      data;
    },
  });
};
