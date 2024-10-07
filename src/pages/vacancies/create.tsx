import CreateOrUpdateVacancyForm from '@/components/vacancy/vacancy-form'; // Import the Vacancy form
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateVacancyPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-vacancy')}{' '}
          {/* Change to the appropriate translation key */}
        </h1>
      </div>
      <CreateOrUpdateVacancyForm /> {/* Update to the Vacancy form component */}
    </>
  );
}

CreateVacancyPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
