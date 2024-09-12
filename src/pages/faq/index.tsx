import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import CouponList from '@/components/coupon/coupon-list';
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
import RegionsList from '@/components/regions/regions-list';
import { useFaqQuery } from '@/data/faq';
import { useMeQuery } from '@/data/user';
import FaqList from '@/components/faq/faq-list';

export default function Faq() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data: me } = useMeQuery()
  console.log('Faq-me = ', me)
  console.log('Faq-me = ', me?.managed_shop?.slug)

  const { faq, loading, paginatorInfo, error } = useFaqQuery({
    code: me?.managed_shop?.slug,
  });

  console.log("faq",faq)

  const { permissions } = getAuthCredentials();
  
  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-faq');

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
            {t('form:input-label-faq')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {/* {canWrite && locale === Config.defaultLanguage && ( */}
            <LinkButton
              href="/faq/create"
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-faq')}</span>
            </LinkButton>
          {/* )} */}
        </div>
      </Card>
      <FaqList
        faq={faq}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Faq.authenticate = {
  permissions: adminOnly,
};

Faq.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
