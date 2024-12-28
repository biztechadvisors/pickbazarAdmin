import Card from '@/components/common/card';
import AttributeList from '@/components/attribute/attribute-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import router, { useRouter } from 'next/router';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useShopQuery } from '@/data/shop';
import { useEffect, useState } from 'react';
import { SortOrder } from '@/types';
// import { useModalAction } from '@/components/ui/modal/modal.context';
import { MoreIcon } from '@/components/icons/more-icon';
import Button from '@/components/ui/button';
import { useAttributesQuery } from '@/data/attributes';
import { Config } from '@/config';
import { useMeQuery } from '@/data/user';
import { Routes } from '@/config/routes';
import { AllPermission } from '@/utils/AllPermission';
import Search from '@/components/common/search';
import AdminLayout from '@/components/layouts/admin';
export default function AttributePage() {
  const router = useRouter();
  const { query, locale } = router;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { permissions } = getAuthCredentials();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: query.shop as string,
  });

  const shopId = shopData?.id;
  const shopSlug = shopData?.slug;

  const {  attributes, paginatorInfo, loading, error } = useAttributesQuery(
    {
      limit: 10,
      page,
      shop_id: shopId,
      slug: shopSlug,
      language: locale,
      search: searchTerm,
    },
    { enabled: Boolean(shopId) }
  );
  const totalPages = Math.ceil((paginatorInfo?.total || 0) / (paginatorInfo?.perPage || 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [paginatorInfo?.total, paginatorInfo?.perPage, page]);

  if (!isClient || loading || fetchingShop) {
    return <Loader text={t('common:text-loading')} />;
  }

  if (error) return <ErrorMessage message={error.message} />;

  if (!hasAccess(adminOnly, permissions)) {
    router.replace(Routes.dashboard);
    return null;
  }

  function handleSearch({ searchText }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col md:flex-row">
        <div className="mb-4 md:w-1/4">
          <h1 className="text-xl font-semibold">{t('common:attributes')}</h1>
        </div>
        <div className="flex w-full md:w-3/4">
          <Search onSearch={handleSearch} />
          <LinkButton
            href={`/${shopSlug}/attributes/create`}
            className="ms-6 h-12"
          >
            {t('form:button-label-add')}
          </LinkButton>
        </div>

      </Card>
      <AttributeList
        attributes={attributes}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />
    </>
  );
}

AttributePage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form'])),
  },
});