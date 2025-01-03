import Layout from '@/components/layouts/admin';
import CreateOrUpdateCategoriesForm from '@/components/category/category-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCategoryQuery } from '@/data/category';
import { Config } from '@/config';
import AdminLayout from '@/components/layouts/admin';
import { useMeQuery } from '@/data/user';


export default function UpdateCategoriesPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { data: meData } = useMeQuery(); // Fetch the current user data
const shop = meData?.managed_shop; // Extract the managed shop details
const shopId = shop?.id ? Number(shop.id) : undefined;

  const {
    category,
    isLoading: loading,
    error,
  } = useCategoryQuery({ 
    slug: query.categorySlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage, 
      shopId,
  });
console.log("%%%%%%%%%%%%%ID",category);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-category')}
        </h1>
      </div>

      <CreateOrUpdateCategoriesForm initialValues={category} />
    </>
  );
}

UpdateCategoriesPage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
