import AdminLayout from '@/components/layouts/admin';
import SettingsForm from '@/components/settings/settings-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useSettingsQuery } from '@/data/settings';
import { useShippingClassesQuery } from '@/data/shipping';
import { useTaxesQuery } from '@/data/tax';
import { useMeQuery } from '@/data/user';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function Settings() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data: meData } = useMeQuery();
  const shop_slug = meData?.shops[0]?.slug;
  const shop_id = meData?.shop_id;
  const { taxes, loading: taxLoading } = useTaxesQuery({
    limit: 999,
    shop_id,
  });

  const { shippingClasses, loading: shippingLoading } =
    useShippingClassesQuery();

  const { settings, loading, error } = useSettingsQuery({
    language: locale!,
    shop_slug="xyz",
  });

  if (loading || shippingLoading || taxLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-settings')}
        </h1>
      </div>
      <SettingsForm
        // TODO: fix it
        // @ts-ignore
        settings={settings}
        taxClasses={taxes}
        shippingClasses={shippingClasses}
      />
    </>
  );
}
Settings.authenticate = {
  permissions: adminOnly,
};
Settings.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
