import {
  Vacancy,
  VacancyInput,
  VacancyQueryOptions,
  VacancyPaginator,
} from '@/types'; // Ensure Vacancy types are defined
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const vacancyClient = {
  ...crudFactory<Vacancy, any, VacancyInput>(API_ENDPOINTS.VACANCY), // Adjust the endpoint to VACANCY
  get({ id, language }: { id: string; language?: string }) {
    console.log(id, '  = Vacancy ID');
    return HttpClient.get<Vacancy>(`${API_ENDPOINTS.VACANCY}/${id}`);
  },
  paginated: ({ ...params }: { params: Partial<VacancyQueryOptions> }) => {
    console.log('params', params);
    if (params.code) {
      return HttpClient.get<VacancyPaginator>(`${API_ENDPOINTS.VACANCY}`); // Adjust to work with vacancy codes
    }
    return HttpClient.get<VacancyPaginator>(API_ENDPOINTS.VACANCY, { params }); // Default for paginated
  },
};
