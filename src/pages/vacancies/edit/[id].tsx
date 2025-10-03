import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateVacancyForm from '@/components/vacancy/vacancy-form'; // Import the Vacancy form
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useVacancySingleDataQuery } from '@/data/vacancies'; // Use the vacancy query
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function UpdateVacancyPage() {
  const { t } = useTranslation();
  const { query } = useRouter();

  const {
    data,
    isLoading: loading,
    error,
  } = useVacancySingleDataQuery(query.id as string); // Fetch vacancy data

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Update Vacancy #{data?.id}{' '}
          {/* Update the title to reflect vacancies */}
        </h1>
      </div>
      <CreateOrUpdateVacancyForm initialValues={data} />{' '}
      {/* Update to use the Vacancy form */}
    </>
  );
}

UpdateVacancyPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }; // Adjust if you have predefined paths
};
