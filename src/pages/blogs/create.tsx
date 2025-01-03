import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import AdminLayout from '@/components/layouts/admin';
import BlogCreateOrUpdateForm from '@/components/blog/blog-form';

export default function CreateAttributePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:create-new-blog')}
        </h1>
      </div>
      <BlogCreateOrUpdateForm/>
    </>
  );
}
CreateAttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
CreateAttributePage.Layout = AdminLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form'])),
  },
});
