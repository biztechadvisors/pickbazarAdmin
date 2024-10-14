import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { vacancyClient } from './client/vacancies'; // Import the vacancy client
import { Vacancy, VacancyPaginator, VacancyQueryOptions } from '@/types'; // Ensure Vacancy types are defined
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';

export const useCreateVacancyMutation = (shop_id) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation((data) => vacancyClient.create({ ...data, shop_id }), {
    onSuccess: () => {
      router.push(Routes.vacancies.list); // Adjust the route for vacancies
      toast.success(t('common:successfully-created'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.VACANCY); // Adjust endpoint
    },
  });
};

export const useVacancyQuery = (
  params: Partial<VacancyQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<VacancyPaginator, Error>(
    [API_ENDPOINTS.VACANCY, params],
    ({ queryKey, pageParam }) =>
      vacancyClient.paginated(Object.assign({}, queryKey[1], pageParam)), // Adjust for pagination
    {
      keepPreviousData: true,
      ...options,
    }
  );
  console.log('Vacancy data here', data);
  return {
    vacancies: data || [], // Adjust to match the vacancy structure
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useUpdateVacancyMutation = (shop_id) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation((data) => vacancyClient.update({ ...data, shop_id }), {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.VACANCY); // Adjust endpoint
    },
  });
};

export const useDeleteVacancyMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(vacancyClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.VACANCY); // Adjust endpoint
    },
  });
};

export const useVacancySingleDataQuery = (id: string) => {
  return useQuery<Vacancy, Error>(
    [API_ENDPOINTS.VACANCY, id],
    () => vacancyClient.get({ id }) // Adjust client method for single vacancy
  );
};
