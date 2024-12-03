import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import CustomerList from '@/components/user/user-list';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  ownerOnly,
} from '@/utils/auth-utils';
import { AllPermission } from '@/utils/AllPermission';
import OwnerLayout from '@/components/layouts/owner';
import AppLayout from '@/components/layouts/app';
import AdminLayout from '@/components/layouts/admin';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data } = useMeQuery();

  const { users, paginatorInfo, loading, error } = useUsersQuery({
    limit: 20,
    usrById: data?.id,
    email: searchTerm,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
    role: 'user',
  });

  console.log('data?.id', data?.id);
  console.log('users', users);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-customer')}
          </h1>
        </div>
        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <div className="flex w-full items-center">
            <Search onSearch={handleSearch} />
            <LinkButton
              href={`${Routes.user.create}`}
              className="h-12 ms-4 md:ms-6"
            >
              <span>+ {t('form:button-label-add-user')}</span>
            </LinkButton>
          </div>
        </div>
      </Card>

      {loading ? null : (
        <CustomerList
          customers={users}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      )}
    </>
  );
}

Customers.authenticate = {
  permissions: adminAndOwnerOnly,
};
Customers.Layout = OwnerLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
