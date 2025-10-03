import { useEffect } from 'react';
import Loader from '@/components/ui/loader/loader';
import { useLogoutMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';

function SignOut() {
  const { t } = useTranslation();
  const { mutate: logout, isSuccess, isError, error } = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (isSuccess) {
      // Show success toast here only once
      toast.success(t('common:successfully-logout'));
    }
    if (isError && error) {
      // Show error toast if there's an error
      toast.error(t('common:logout-failed', { error: error.message }));
    }
  }, [isSuccess, isError, error, t]);

  return <Loader text={t('common:signing-out-text')} />;
}

export default SignOut;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});