import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { settingsClient } from './client/settings';
import { useSettings } from '@/contexts/settings.context';
import { Settings } from '@/types';

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

// export const useSettingsQuery = ({ language , shop_slug}: { language: string , shop_slug:string}) => {
//   const { data, error, isLoading } = useQuery<Settings, Error>(
//     [API_ENDPOINTS.SETTINGS, { language }],
//     () => settingsClient.all({ language, shop_slug })
//   );

//   return {
//     settings: data ?? {},
//     error,
//     loading: isLoading,
//   };
// };

export const useSettingsQuery = ({
  language,
  shop_slug,
}: {
  language: string;
  shop_slug: string;
}) => {
  const query = useQuery<Settings, Error>(
    [API_ENDPOINTS.SETTINGS, { language, shop_slug }],
    () => settingsClient.all({ language, shop_slug })
  );

  return {
    settings: query.data ?? {},
    error: query.error,
    loading: query.isLoading,
    refetch: query.refetch,
  };
};
