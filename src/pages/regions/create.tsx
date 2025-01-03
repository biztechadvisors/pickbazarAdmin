import Layout from '@/components/layouts/admin';
import CreateOrUpdateRegionsForm from '@/components/regions/region-form';
import CreateOrUpdateShippingForm from '@/components/shipping/shipping-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateRegionsPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-regions')}
        </h1>
      </div>
      <CreateOrUpdateRegionsForm />
    </>
  );
}
CreateRegionsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
