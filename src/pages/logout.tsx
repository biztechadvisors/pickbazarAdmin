// import { useEffect } from 'react';
// import Loader from '@/components/ui/loader/loader';
// import { useLogoutMutation } from '@/data/user';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useRouter } from 'next/router';
// import { toast } from 'react-toastify'; // Ensure correct import

// function SignOut() {
//   const { t } = useTranslation();
//   const { mutate: logout, isSuccess, isError, error } = useLogoutMutation();
//   const router = useRouter();

//   useEffect(() => {
//     logout();
//   }, [logout]);

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success(t('common:successfully-logout'));
//       router.replace(Routes.login);
//     } else if (isError) {
//       toast.error(t('common:logout-failed', { error: error?.message }));
//     }
//   }, [isSuccess, isError, error, t, router]);

//   return <Loader text={t('common:signing-out-text')} />;
// }

// export default SignOut;

// export const getStaticProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common'])),
//   },
// });


import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader/loader';
import { useLogoutMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function SignOut() {
  const { t } = useTranslation();
  const { mutate: logout, isSuccess, isError, error } = useLogoutMutation();
  const router = useRouter();
  const [toastShown, setToastShown] = useState(false); // State to track if toast has been shown

  useEffect(() => {
    console.log('Component mounted or updated');
    logout(); // Initiate logout on component mount
  }, [logout]);

  useEffect(() => {
    console.log('Effect triggered', { isSuccess, isError, error });

    if (isSuccess && !toastShown) {
      toast.success(t('common:successfully-logout'), {
        onClose: () => {
          console.log('Toast closed, redirecting to login');
          router.replace('/login');
        },
      });
      setToastShown(true); // Set state to true after showing toast
    } else if (isError) {
      toast.error(t('common:logout-failed', { error: error?.message }));
    }
  }, [isSuccess, isError, error, t, router, toastShown]);

  if (!isSuccess && !isError) {
    return <Loader text={t('common:signing-out-text')} />;
  }

  return null; // Render nothing once logout process is complete
}

export default SignOut;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
