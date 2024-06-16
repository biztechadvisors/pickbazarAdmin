import AdminLayout from '@/components/layouts/admin';
import SettingsForm from '@/components/settings/settings-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useSettingsQuery } from '@/data/settings';
import { useShippingClassesQuery } from '@/data/shipping';
import { useTaxesQuery } from '@/data/tax';
import { useMeQuery } from '@/data/user';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data: meData } = useMeQuery();
  const shop_id = meData?.shops?.[0]?.id;

  const { settings, loading: settingsLoading, error: settingsError, shopSlug } = useSettingsQuery({
    language: locale!,
  });

  const { taxes, loading: taxLoading } = useTaxesQuery({
    limit: 999,
    shop_id: shop_id,
  });

  const { shippingClasses, loading: shippingLoading } = useShippingClassesQuery();

  if (!shopSlug) {
    return <Loader text={t('common:text-loading')} />;
  }

  if (settingsLoading || taxLoading || shippingLoading) {
    return <Loader text={t('common:text-loading')} />;
  }

  if (settingsError) {
    return <ErrorMessage message={settingsError.message} />;
  }

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-settings')}
        </h1>
      </div>
      <SettingsForm
        settings={settings}
        taxClasses={taxes}
        shippingClasses={shippingClasses}
      />
    </>
  );
};

Settings.authenticate = {
  permissions: adminOnly,
};

Settings.Layout = AdminLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['form', 'common'])),
  },
});

export default Settings;