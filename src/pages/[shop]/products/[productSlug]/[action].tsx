import CreateOrUpdateProductForm from '@/components/product/product-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useProductQuery, useProductsQuery } from '@/data/product';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import AdminLayout from '@/components/layouts/admin';

export default function UpdateProductPage() {
  const { query, locale } = useRouter(); 
  const { t } = useTranslation();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: query?.shop as string,
  });
  
  // const shop_id = shopData?.id ? Number(shopData.id) : undefined; 
  const shop_id = shopData?.id!;
  const { products, loading: productsLoading } = useProductsQuery({
    shop_id,
    slug: query.productSlug as string, // Ensure filtering by slug
  });
  
  // Extract productId if available
  const productId = products?.find(
    (product) => product.slug === query.productSlug
  )?.id; 
 
 
  const {
    product,
    isLoading: loading,
    error,
  } = useProductQuery({
    slug: query.productSlug as string,
    shop_id,
    id: productId,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });  

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-product')}
        </h1>
      </div>
      <CreateOrUpdateProductForm initialValues={product} />
    </>
  );
}
UpdateProductPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
UpdateProductPage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
