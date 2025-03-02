import { useTranslation } from 'next-i18next';
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function HelpInventoryPage() {
  const { t } = useTranslation();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">{t('common:help-inventory-title')}</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">1. {t('common:add-collection')}</h2>
          <p>{t('common:add-collection-description')}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">2. {t('common:add-attribute')}</h2>
          <p>{t('common:add-attribute-description')}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">3. {t('common:add-category')}</h2>
          <p>{t('common:add-category-description')}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">4. {t('common:add-subcategory')}</h2>
          <p>{t('common:add-subcategory-description')}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">5. {t('common:add-product')}</h2>
          <p>{t('common:add-product-description')}</p>
        </div>
      </div>
    </div>
  );
}

HelpInventoryPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});