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
import { useState } from 'react';
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
  const {
    query: { shop },
    locale,
  } = useRouter();
  const { permissions } = getAuthCredentials();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  // const { openModal } = useModalAction();
  const [orderBy, setOrder] = useState('updated_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data: me } = useMeQuery();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shop as string,
  });
  
  const shopId = shopData?.id!;
  const shopSlug = shopData?.slug

  

  const { attributes, loading, error } = useAttributesQuery(
    {
      shop_id: shopId,
      slug: shopSlug,
      orderBy,
      sortedBy,
      language: locale,
    },
    {
      enabled: Boolean(shopId),
    }
  );



  

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-attributes');

  if (loading || fetchingShop)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  // function handleSearch({ searchText }: { searchText: string }) {
  //   setSearchTerm(searchText);
  //   setPage(1);
  // }

  function handleSearch({ searchText }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  const filteredAttributes = attributes.filter(attribute =>
    attribute.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-attributes')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-3/4 md:flex-row xl:w-2/4">
          <Search onSearch={handleSearch} />

          {canWrite && locale === Config.defaultLanguage && (
            <LinkButton
              href={`/${shop}/attributes/create`}
              // className="mt-5 h-12 w-full md:mt-0 md:w-auto md:ms-auto"
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                + {t('form:button-label-add')} {t('common:attribute')}
              </span>
            </LinkButton>
          )}

          {/* <Button onClick={handleImportModal} className="mt-5 w-full md:hidden">
            {t('common:text-export-import')}
          </Button> */}

          {/* <button
            onClick={handleImportModal}
            className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 transition duration-300 ms-6 hover:bg-gray-100 md:flex"
          >
            {canWrite && (
              <MoreIcon className="w-3.5 text-body" />
            )}
          </button> */}
        </div>
      </Card>
      <AttributeList
        attributes={attributes}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
AttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
AttributePage.Layout = AdminLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
