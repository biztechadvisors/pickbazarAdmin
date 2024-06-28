import { useEffect } from 'react';
import LoginForm from '@/components/auth/login-form';
import { useTranslation } from 'next-i18next';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import AuthPageLayout from '@/components/layouts/auth-layout';
import { Routes } from '@/config/routes';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { token, permissions } = getAuthCredentials();

  useEffect(() => {
    if (isAuthenticated({ token, permissions })) {
      router.replace(Routes.dashboard);
    }
  }, [token, permissions, router]);

  return (
    <AuthPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base italic text-body">
        {t('admin-login-title')}
      </h3>
      <LoginForm />
    </AuthPageLayout>
  );
}
