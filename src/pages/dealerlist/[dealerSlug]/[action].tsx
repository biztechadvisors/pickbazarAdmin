import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateOrUpdateDealerForm from '@/components/dealerlist/add-dealer-form';
import { useDealerQueryGet } from '@/data/dealer';
import Loader from '@/components/ui/loader/loader';

export default function UpdateDealerPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const  id : any = query.dealerSlug;
  const {
    data,
    isLoading,
    error,
  } = useDealerQueryGet({id});
  
  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  
  var initialValues: any = data;

  console.log("initialValues", initialValues)

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-dealer')}
        </h1>
      </div>
      <CreateOrUpdateDealerForm initialValues={initialValues} id={id} />
    </>
  );
}
UpdateDealerPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
