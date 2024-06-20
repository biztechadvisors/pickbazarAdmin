import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopForm from '@/components/shop/shop-form';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useShopQuery } from '@/data/shop';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import AdminLayout from '@/components/layouts/admin';
import { OWNER } from '@/utils/constants';
import OwnerLayout from '@/components/layouts/owner';

export default function UpdateShopPage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { query } = useRouter();
  const { shop } = query;
  const { t } = useTranslation();
  const {
    data,
    isLoading: loading,
    error,
  } = useShopQuery({
    slug: shop as string,
  });

  console.log('ShopForm*** 41', data)

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(data?.id) &&
    me?.managed_shop?.id != data?.id
  ) {
    router.replace(Routes.dashboard);
  }
  return (
    <>
      <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-shop')}
        </h1>
      </div>
      <ShopForm initialValues={data} />
    </>
  );
}
UpdateShopPage.authenticate = {
  permissions: adminAndOwnerOnly,
};

UpdateShopPage.Layout = OwnerLayout;
// permissions?.[0] === OWNER ? OwnerLayout : AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
