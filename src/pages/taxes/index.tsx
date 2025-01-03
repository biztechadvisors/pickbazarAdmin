import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import TaxList from '@/components/tax/tax-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useTaxesQuery } from '@/data/tax';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { siteSettings } from '@/settings/site.settings';
import { AllPermission } from '@/utils/AllPermission';
import { useMeQuery } from '@/data/user';

export default function TaxesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearch] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data: meData } = useMeQuery()
  const [page, setPage] = useState(1);
  const shop_id = meData?.shop_id
  const { taxes,paginatorInfo, loading, error } = useTaxesQuery({
    // name: searchTerm,
    orderBy,
    sortedBy,
    shop_id,
    search:searchTerm,
    page,
    limit:10,
  });


  const { permissions } = getAuthCredentials();

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-taxes');

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }
  function handlePagination(current: number) {
    setPage(current);
  }
  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-taxes')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          {/* <Search onSearch={handleSearch} /> */}
          {canWrite ? (
            <LinkButton
              href={`${Routes.tax.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-tax')}</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>
      {!loading ? (
        <TaxList
         taxes={taxes} 
         paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
         onOrder={setOrder} onSort={setColumn} />
      ) : null}
    </>
  );
}

TaxesPage.authenticate = {
  permissions: adminOnly,
};
TaxesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
