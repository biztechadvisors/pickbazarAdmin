import React from 'react';
import { useTranslation } from 'next-i18next';

interface FooterProps {
  canWrite: boolean;
  shopName?: string;
}

const Footer: React.FC<FooterProps> = ({ canWrite, shopName }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white shadow-md py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className=" text-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} {shopName || t('common:default-shop-name')}.{' '}
            {t('common:footer-all-rights-reserved')}
          </p>
          {canWrite && (
            <p className="mt-2">
              {t('common:footer-admin-access')} |{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                {t('common:footer-terms')}
              </a>{' '}
              |{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                {t('common:footer-privacy')}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
