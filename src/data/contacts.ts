import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { contactsClient } from './client/contacts'; // Updated to use contactsClient
import { Contact, ContactPaginator, ContactQueryOptions } from '@/types'; // Updated types for contacts
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';

export const useContactsQuery = (
  params: Partial<ContactQueryOptions>, // Changed type to ContactQueryOptions
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<ContactPaginator, Error>( // Changed to ContactPaginator
    [API_ENDPOINTS.CONTACTS, params], // Updated endpoint
    ({ queryKey, pageParam }) =>
      contactsClient.paginated(Object.assign({}, queryKey[1], pageParam)), // Changed to contactsClient
    {
      keepPreviousData: true,
      ...options,
    }
  );
  return {
    contacts: data || [], // Updated to contacts
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// Delete Contact Entry
export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(contactsClient.delete, {
    // Changed to contactsClient
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACTS); // Updated endpoint
    },
  });
};

// Query single Contact Entry
export const useGetContactSingleDataQuery = (id: string) => {
  return useQuery<Contact, Error>(
    [API_ENDPOINTS.CONTACTS, id],
    () =>
      // Changed to Contact
      contactsClient.get({ id }) // Changed to contactsClient
  );
};
