import Layout from '@/components/layouts/admin';
import CreateOrUpdateSubCategoriesForm from '@/components/subcategory/subcategory-form';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import AdminLayout from '@/components/layouts/admin';


export default function CreateCategoriesPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-subcategory')}
        </h1>
      </div>
      <CreateOrUpdateSubCategoriesForm />
    </>
  );
}

CreateCategoriesPage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
