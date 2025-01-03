import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { qnaClient } from './client/qna'; // Import your QnA client
import { Qna, QnaFormValues, QnaPaginator, QnaQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';

// Hook to create a QnA item
export const useCreateQnaMutation = (faqId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(
    (data: Omit<Qna, 'id'>) => qnaClient.createQna(data), // Include faqId in the data being sent
    {
      onSuccess: () => {
        router.push(Routes.faq.list); // Navigate to QnA list after creation
        toast.success(t('common:successfully-created'));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.QNA); // Invalidate QnA queries on success
      },
    }
  );
};

// Hook to query a list of QnA items
export const useQnaQuery = (
  params: Partial<QnaQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<QnaPaginator, Error>(
    [API_ENDPOINTS.FAQ, params.faqId], // Use FAQ ID as part of the query key
    ({ queryKey }) => {
      const faqId = queryKey[1]; // Extract the FAQ ID from the query key
      return qnaClient.paginated({ faqId });
    },
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    qna: data || [], // Fallback to an empty array if no data
    paginatorInfo: mapPaginatorData(data), // Map pagination data if necessary
    error,
    loading: isLoading,
  };
};

// Hook to update an existing QnA item
// export const useUpdateQnaMutation = (shop_id) => {
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();

//   return useMutation(({ id, ...data }) => qnaClient.updateQna(data, id), {
//     // Pass `id` (qnaId) separately
//     onSuccess: () => {
//       toast.success(t('common:successfully-updated'));
//     },
    // onSettled: () => {
    //   queryClient.invalidateQueries(API_ENDPOINTS.QNA); // Invalidate QnA queries on success
    // },
//   });
// };
export const useUpdateQnaMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  return useMutation(
    ({ id, ...data }: { id: number } & QnaFormValues) => qnaClient.updateQna(data, id),
    {
      onSuccess: () => {
        router.push(Routes.faq.list);
        toast.success(t('common:successfully-updated'));
        queryClient.invalidateQueries(API_ENDPOINTS.QNA);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.QNA); // Invalidate QnA queries on success
      },
    }
  );
};

// Hook to delete a QnA item
export const useDeleteQnaMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(qnaClient.deleteQna, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.QNA); // Invalidate QnA queries on success
    },
  });
};

// Hook to fetch single QnA item data
export const useQnaSingleDataQuery = (id: string) => {
  console.log('idQna = ',id)
  return useQuery<Qna, Error>([API_ENDPOINTS.QNA, id], () =>
    qnaClient.get({ id })
  );
};
