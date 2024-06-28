import { useEffect, useRef } from 'react';
import Loader from '@/components/ui/loader/loader';
import { useLogoutMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';

function SignOut() {
  const { t } = useTranslation();
  const { mutate: logout } = useLogoutMutation();
  const hasLoggedOut = useRef(false); 

  useEffect(() => {
    console.log('SignOut useEffect called');
    if (!hasLoggedOut.current) {
      logout();
      hasLoggedOut.current = true;
    }
  }, [logout]);

  return <Loader text={t('common:signing-out-text')} />;
}

export default SignOut;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
