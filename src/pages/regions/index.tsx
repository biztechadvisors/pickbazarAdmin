import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { AllPermission } from '@/utils/AllPermission';
import RegionsList from '@/components/regions/regions-list';
import { useMeQuery } from '@/data/user';
import { useRegionsQuery } from '@/data/regions';

export default function Regions() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data: me } = useMeQuery()
  const { regions, loading, paginatorInfo, error } = useRegionsQuery({
    code: me?.managed_shop?.slug,
    page,
    limit:10,
    search: searchTerm,
  });
   const { permissions } = getAuthCredentials();
  
  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-regions');

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }
   
  
  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-regions')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {/* {canWrite && locale === Config.defaultLanguage && ( */}
            <LinkButton
              href="/regions/create"
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-regions')}</span>
            </LinkButton>
          {/* )} */}
        </div>
      </Card>
      <RegionsList
        regions={regions}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Regions.authenticate = {
  permissions: adminOnly,
};

Regions.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
