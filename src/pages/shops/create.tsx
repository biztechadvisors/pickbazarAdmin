import OwnerLayout from '@/components/layouts/owner';
import ShopForm from '@/components/shop/shop-form';
import { adminAndOwnerOnly, getAuthCredentials, ownerAndStaffOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useMeQuery, useUserQuery } from '@/data/user';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import AdminLayout from '@/components/layouts/admin';
import { OWNER } from '@/utils/constants';

export default function CreateShopPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-shop')}
        </h1>
      </div>
      <ShopForm />
    </>
  );
}

CreateShopPage.authenticate = {
  permissions: ownerAndStaffOnly,
};
CreateShopPage.Layout =
  getAuthCredentials().permissions?.[0] === OWNER
    ? OwnerLayout
    : AdminLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

