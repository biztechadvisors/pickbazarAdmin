import { StaffQueryOptions, StaffPaginator, AddStaffInput, DealerQueryOptions, AddDealerInput, DealerPaginator } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const dealerClient = {
    paginated: ({ ...params }: Partial<DealerQueryOptions>) => {
        return HttpClient.get<DealerPaginator>(API_ENDPOINTS.DEALER, {
            searchJoin: 'and',
            ...params,
            search: HttpClient.formatSearchParams({}),
        });
    },
    getAllDealer: () => {
        return HttpClient.get<any>(`${API_ENDPOINTS.DEALER}`);
    },

    addDealer: (variables: AddDealerInput) => {
        return HttpClient.post<any>(API_ENDPOINTS.DEALER, variables);
    },

    getDealer: ({ id }: { id: string }) => {
        return HttpClient.get<any>(`${API_ENDPOINTS.DEALER}/${id}`);
    },

    updateDealer: (variables: AddDealerInput) => {
        return HttpClient.put<any>(`${API_ENDPOINTS.DEALER}/${variables.id}`, variables);
    },

    removeDealer: ({ id }: { id: string }) => {
        return HttpClient.delete<any>(`${API_ENDPOINTS.DEALER}/${id}`);
    },
};