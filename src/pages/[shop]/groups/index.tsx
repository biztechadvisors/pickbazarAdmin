import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/type';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { Config } from '@/config';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { siteSettings } from '@/settings/site.settings';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { AllPermission } from '@/utils/AllPermission';
import AdminLayout from '@/components/layouts/admin';

export default function TypesPage() {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: meData } = useMeQuery();

  const {
    query: { shops },
  } = useRouter();

  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shops as string,
  });

  const shopId = shopData?.id!;
  const shop_Slug = shopData?.slug

  const shop: string | undefined = meData?.managed_shop?.id;
  const shopSlug: string | undefined = meData?.managed_shop?.slug;
  const { types, loading, error } = useTypesQuery({
    // name: searchTerm,
    language: locale,
    orderBy,
    sortedBy,
    shop,
    slug: shop_Slug,
    search:searchTerm,
  });
  const { permissions } = getAuthCredentials();
  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-groups');

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  if (
    !hasAccess(adminOnly, permissions) &&
    !meData?.shops?.map((shop) => shop.id).includes(shopId) &&
    meData?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-groups')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {/* {locale === Config.defaultLanguage && (
            <LinkButton
              href={Routes.type.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-group')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          )} */}
          {canWrite && locale === Config.defaultLanguage && (
            <LinkButton
              href={`/${shopSlug}${Routes.type.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-group')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          )}
        </div>
      </Card>
      <TypeList types={types} onOrder={setOrder} onSort={setColumn} />
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

TypesPage.Layout = AdminLayout;

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
//   },
// });

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
