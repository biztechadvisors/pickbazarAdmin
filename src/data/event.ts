import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { eventClient } from './client/event';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';

export const useCreateMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(eventClient.create, {
    onSuccess: () => {
      Router.push(Routes.event.list); // Updated route from blog to events
      toast.success(t('common:successfully-created'));
    },
    onError: (error) => {
      toast.error(t('common:failed-to-create'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EVENTS); // Updated endpoint
    },
  });
};
