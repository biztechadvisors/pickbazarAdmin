import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateGetInspiredForm from '@/components/getInspired/getInspired-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useGetInspiredSingleDataQuery } from '@/data/get-inspired';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function UpdateGetInspiredPage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  console.log('query =', query);

  // Fetch data for the specific Get Inspired item
  const {
    data,
    isLoading: loading,
    error,
  } = useGetInspiredSingleDataQuery(query.id as string);
  console.log('data ====', data);

  // Check if loading or error occurs
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  console.log('data =', data);

  // Transforming the initial values to match the expected format
  const initialValues = {
    id: data.id,
    title: data.title,
    type: data.type,
    gallery: data.images.map((image) => ({
      url: image.original, // Using the original URL for the gallery
    })),
    tagIds: data.tags.map((tag) => tag.id), // Only getting the tag IDs
  };

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Update GetInspired #{data.id}
        </h1>
      </div>
      <CreateOrUpdateGetInspiredForm initialValues={initialValues} />
    </>
  );
}
UpdateGetInspiredPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
