import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateQnaForm from '@/components/qna/qna-form'; // Adjust to your QnA form component
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useQnaSingleDataQuery } from '@/data/qna'; // Ensure you have this query hook for QnA
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function UpdateQnaPage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const {
    data:qnaData,
    isLoading: loading,
    error,
  } = useQnaSingleDataQuery(query.id as string); // Fetch QnA data

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Update QnA #{qnaData?.id}
        </h1>
      </div>
      <CreateOrUpdateQnaForm  
      qnaId={qnaData?.id}
        faqId={qnaData?.faqId}
        initialValues={qnaData} />{' '}
      {/* Pass QnA data to form */}
    </>
  );
}

UpdateQnaPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])), // Add necessary namespaces for translations
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }; // Enable fallback to handle dynamic routes
};
