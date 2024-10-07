import {
  ContactQueryOptions,
  Contact,
  ContactInput,
  ContactPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const contactsClient = {
  ...crudFactory<Contact, any, ContactInput>(
    API_ENDPOINTS.CONTACTS // Updated for contacts
  ),

  get({ id, language }: { id: string; language: string }) {
    console.log(id, ' = Contact ID');
    return HttpClient.get<Contact>(`${API_ENDPOINTS.CONTACTS}/${id}`, {
      language,
    });
  },

  paginated: ({ ...params }: { params: Partial<ContactQueryOptions> }) => {
    console.log('params', params);
    if (params.shopSlug) {
      // Update to use query params for the shop slug
      return HttpClient.get<ContactPaginator>(
        `${API_ENDPOINTS.CONTACTS}/shop/${params.shopSlug}` // Corrected URL structure
      );
    }
  },
};
