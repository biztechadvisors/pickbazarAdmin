import { useEffect } from 'react';
import Loader from '@/components/ui/loader/loader';
import { useLogoutMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

function SignOut() {
  const { t } = useTranslation();
  const { mutate: logout, isSuccess, isError, error } = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('common:successfully-logout'));
      router.replace(Routes.login);
    } else if (isError) {
      toast.error(t('common:logout-failed', { error: error?.message }));
    }
  }, [isSuccess, isError, error, t, router]);

  return <Loader text={t('common:signing-out-text')} />;
}

export default SignOut;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
