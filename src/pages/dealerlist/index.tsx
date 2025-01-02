import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
} from '@/utils/auth-utils';
import { Config } from '@/config';
import DealerTypeList from '@/components/dealerlist/dealer-list';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useDealerQuery, useDealerQueryGet } from '@/data/dealer';
import { AllPermission } from '@/utils/AllPermission';
import { DEALER, OWNER } from '@/utils/constants';
import AdminLayout from '@/components/layouts/admin';

export default function DealerPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const { data } = useMeQuery();
  const [page, setPage] = useState(1);
  const { users, paginatorInfo, loading, error } = useUsersQuery({
    type: DEALER,
    usrById: data?.id,
    name: searchTerm,
    // language: locale,
    orderBy,
    sortedBy,
    limit: 10,
    page,
  });

  const userdealer = users.filter(
    (user) => user?.permission?.type_name === DEALER
  );
  console.log('userDealer', userdealer);
  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-dealerlist');

  // const {
  //   data,
  //   isLoading,
  // } = useDealerQueryAllGet();

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-dealerlist')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={Routes.user.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-dealerlist')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add-dealerlist')}
              </span>
            </LinkButton>
          )}
        </div>
      </Card>
      <DealerTypeList
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        users={userdealer}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

const { permissions } = getAuthCredentials();
const resLayout = () => {
  return permissions?.[0] === OWNER ? OwnerLayout : AdminLayout;
};

DealerPage.Layout = resLayout();

DealerPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
