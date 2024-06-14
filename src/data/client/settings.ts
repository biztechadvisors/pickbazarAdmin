import { Settings, SettingsInput, SettingsOptionsInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from '@/data/client/http-client';

export const settingsClient = {
  ...crudFactory<Settings, any, SettingsOptionsInput>(API_ENDPOINTS.SETTINGS),

  all({ language, shopSlug }: { language: string; shopSlug: string | null }) {
    return HttpClient.get<Settings>(`${API_ENDPOINTS.SETTINGS}`, {
      params: { language },
      // Add shopSlug to the params object
      shopSlug,
    });
  },

  update: ({ shop_id, ...data }: SettingsInput) => {
    const url = `${API_ENDPOINTS.SETTINGS}?shopId=${shop_id}`;
    return HttpClient.post<Settings>(url, { ...data });
  },
};
