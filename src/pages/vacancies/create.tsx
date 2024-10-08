import CreateOrUpdateVacancyForm from '@/components/vacancy/vacancy-form'; // Import the Vacancy form
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMeQuery } from '@/data/user'; // Import the user query to get the locations

export default function CreateVacancyPage() {
  const { t } = useTranslation();
  const { data: me } = useMeQuery(); // Fetch user data to get locations

  // Check if me is defined and has adds array
  const locations = me?.adds || [];

  console.log('Me data:', me); // Log user data
  console.log('Locations:', locations); // Log locations data

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-vacancy')}
        </h1>
      </div>
      <CreateOrUpdateVacancyForm locations={locations} />{' '}
      {/* Pass locations to the form */}
    </>
  );
}

CreateVacancyPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
