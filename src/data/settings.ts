import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { settingsClient } from './client/settings';
import { useSettings } from '@/contexts/settings.context';
import { Settings } from '@/types';
import { useState } from 'react';
import { useEffect } from 'react';

export const useCreateSettingsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateSettings } = useSettings();

  return useMutation(settingsClient.create, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      updateSettings(data?.options);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
    },
  });
};

export const useUpdateSettingsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateSettings } = useSettings();

  return useMutation(settingsClient.update, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      updateSettings(data?.options);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
    },
  });
};

export const useSettingsQuery = ({ language }: { language: string }) => {
  const [shopSlug, setShopSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = localStorage.getItem('shopSlug');
      setShopSlug(slug);
    }
  }, []);

  const { data, error, isLoading } = useQuery(
    ['settings', { language, shopSlug }],
    () => settingsClient.all({ language, shopSlug }),
    {
      enabled: !!shopSlug,
      initialData: undefined,
    }
  );

  return {
    settings: data ?? {},
    error,
    loading: isLoading,
    shopSlug,
  };
};