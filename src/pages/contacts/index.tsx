import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { AllPermission } from '@/utils/AllPermission';
import { useContactsQuery } from '@/data/contacts';
import { useMeQuery } from '@/data/user';
import ContactsList from '@/components/contacts/contacts-list';

export default function Contacts() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data: me } = useMeQuery();

  // Fetch the contacts data
  const { contacts, loading, paginatorInfo, error } = useContactsQuery({
    shopSlug: me?.managed_shop?.slug, // Use shopSlug instead
  });
  console.log('contacts data', contacts);
  console.log('contacts me', me);

  // Handle permission check
  const { permissions } = getAuthCredentials();
  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-contacts');

  console.log('User Permissions:', permissions);
  console.log('Can Write:', canWrite); // Check if canWrite is true

  // Loader and error handling
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  // Handle search functionality
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  // Handle pagination functionality
  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-contacts')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {/* Button to create a new contact */}
          {canWrite && locale === Config.defaultLanguage && (
            <LinkButton
              href="/contacts/create"
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-contact')}</span>
            </LinkButton>
          )}
        </div>
      </Card>

      {/* List of Contacts */}
      <ContactsList
        contacts={contacts}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

// Authentication and Permissions for Admin Only
Contacts.authenticate = {
  permissions: adminOnly,
};

// Page Layout
Contacts.Layout = Layout;

// Static translations
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
