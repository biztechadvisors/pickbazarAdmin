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
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { Config } from '@/config';
import DealerTypeList from '@/components/dealerlist/dealer-list';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useDealerQuery, useDealerQueryGet } from '@/data/dealer';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { siteSettings } from '@/settings/site.settings';

export default function DealerPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const { data } = useMeQuery();
  const { users, loading, error } = useUsersQuery({
    type: 'Dealer',
    usrById: data?.id,
    name: searchTerm,
    // language: locale,
    orderBy,
    sortedBy,
  });
  
  const userdealer = users.filter((user)=>user?.type?.type_name==='dealer')

  const [getPermission,_]=useAtom(newPermission)
  const { permissions } = getAuthCredentials();
  const canWrite = permissions?.includes('super_admin')
    ? siteSettings.sidebarLinks
    : getPermission?.find(
      (permission) => permission.type === 'sidebar-nav-item-dealerlist'
    )?.write;

  // const {
  //   data,
  //   isLoading,
  // } = useDealerQueryAllGet();

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
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
      <DealerTypeList users={userdealer} onOrder={setOrder} onSort={setColumn} />
    </>
  );
}

DealerPage.authenticate = {
  permissions: adminOnly,
};

DealerPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
