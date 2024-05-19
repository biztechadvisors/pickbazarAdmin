import Layout from '@/components/layouts/admin';
import CreateOrUpdateSubCategoriesForm from '@/components/subcategory/subcategory-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSubCategoryQuery } from '@/data/subcategory';
import { Config } from '@/config';
import ShopLayout from '@/components/layouts/shop';


export default function UpdateCategoriesPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    subcategory,
    isLoading: loading,
    error,
  } = useSubCategoryQuery({
    slug: query.subCategoriesSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
    // categoryId: subcategory.category.id,
    // shopId: subcategory.shop.id,
    });
console.log("extra data'''''''''''''", subcategory)
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;


  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-subcategory')}
        </h1>
      </div>

      <CreateOrUpdateSubCategoriesForm initialValues={subcategory} />
    </>
  );
}


UpdateCategoriesPage.Layout = ShopLayout;


export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
