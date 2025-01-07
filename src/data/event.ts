import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { eventClient } from './client/event';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import { mapPaginatorData } from '@/utils/data-mappers';

export const useCreateEventMutation = () => {
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

export const useUpdateeventMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(eventClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onError: (error: any) => {
      toast.error(t('common:update-failed'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EVENTS);
    },
  });
};

export const useEventQuery = (params: any, options: any = {}) => {
  const { data, error, isLoading } = useQuery(
    [API_ENDPOINTS.EVENTS, params],
    () => eventClient.getAll(params), // Call the paginated API method
    {
      keepPreviousData: true, // Keeps the previous data while loading new data
      ...options,
    }
  );

  return {
    events: data?.data || [], // Fallback to an empty array if no data is available
    paginatorInfo: data ? mapPaginatorData(data) : {}, // Assuming mapPaginatorData handles pagination info
    error,
    loading: isLoading,
  };
};



export const useEventSingleData = (id: any) => {
  return useQuery(
    [API_ENDPOINTS.EVENTS, id],
    () => eventClient.singleData({ id }),
    {
      enabled: !!id, // Fetch only if id exists
    }
  );
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(eventClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
      queryClient.invalidateQueries([API_ENDPOINTS.EVENTS]);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EVENTS);
    },
  });
};
