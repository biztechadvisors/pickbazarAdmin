import { StaffQueryOptions, StaffPaginator, AddStaffInput, RegisterInput, AuthResponse } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const staffClient = {
  paginated: ({ ...params }: Partial<StaffQueryOptions>) => {
    return HttpClient.get<StaffPaginator>(API_ENDPOINTS.STAFFS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({}),
    });
  },
  addStaff:(variables: RegisterInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, variables);
  },
  
  
  removeStaff: ({ id }: { id: string }) => {
    return HttpClient.delete<any>(`${API_ENDPOINTS.REMOVE_STAFF}/${id}`);
  },
};
