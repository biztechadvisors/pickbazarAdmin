import CreateOrUpdateGetInspiredForm from '@/components/getInspired/getInspired-form'; // Import the GetInspired form
import Layout from '@/components/layouts/admin'; // Layout component for the admin panel
import { useTranslation } from 'next-i18next'; // For translations
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // For server-side translations
import { useTagQuery, useTagsQuery } from '@/data/tag'; // Import the tag query hook
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';

export default function CreateGetInspiredPage() {
  const { t } = useTranslation(); // Initialize translation

  const { locale } = useRouter();
  const { data: meData } = useMeQuery();
  const shopSlug = meData?.managed_shop?.slug;
  const {
    tags,
    loading: loading,
    paginatorInfo,
    error,
  } = useTagsQuery({
    limit: 10,
    // orderBy,
    // sortedBy,
    // // name: searchTerm,
    // page,
    language: locale,
    shopSlug,
    // search:searchTerm,
  });

  console.log('Get Inspired Tag', tags, 'slug', shopSlug);

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-get-inspired')}{' '}
          {/* Translation for the title */}
        </h1>
      </div>
      {/* Pass tag as props to the form */}
      <CreateOrUpdateGetInspiredForm
        tags={tags || []}
        // isTagsLoading={isTagsLoading}
      />
    </>
  );
}

CreateGetInspiredPage.Layout = Layout; // Set layout for the page

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])), // Load translations for the page
  },
});
