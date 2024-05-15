// import dynamic from 'next/dynamic';
// import type { GetServerSideProps } from 'next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import {
//   allowedRoles,
//   getAuthCredentials,
//   hasAccess,
//   isAuthenticated,
// } from '@/utils/auth-utils';
// import { DEALER, STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
// import AppLayout from '@/components/layouts/app';
// import { Routes } from '@/config/routes';
// import { Config } from '@/config';

// const AdminDashboard = dynamic(() => import('@/components/dashboard/admin'));
// const OwnerDashboard = dynamic(() => import('@/components/dashboard/owner'));

// export default function Dashboard({
//   userPermissions,
// }: {
//   userPermissions: string[];
// }) {
//   if (userPermissions?.includes(DEALER)) {
//     return <AdminDashboard />;
//   }
//   return <OwnerDashboard />;
// }

// Dashboard.Layout = AppLayout;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { locale } = ctx;
//   // TODO: Improve it
//   const generateRedirectUrl =
//     locale !== Config.defaultLanguage
//       ? `/${locale}${Routes.login}`
//       : Routes.login;
//   const { token, permissions } = getAuthCredentials(ctx);
//   if (
//     !isAuthenticated({ token, permissions }) ||
//     !hasAccess(allowedRoles, permissions)
//   ) {
//     return {
//       redirect: {
//         destination: generateRedirectUrl,
//         permanent: false,
//       },
//     };
//   }
//   if (locale) {
//     return {
//       props: {
//         ...(await serverSideTranslations(locale, [
//           'common',
//           'table',
//           'widgets',
//         ])),
//         userPermissions: permissions,
//       },
//     };
//   }
//   return {
//     props: {
//       userPermissions: permissions,
//     },
//   };
// };

import dynamic from 'next/dynamic';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils';
import {
  ADMIN,
  DEALER,
  STAFF,
  STORE_OWNER,
  SUPER_ADMIN,
} from '@/utils/constants';
import AppLayout from '@/components/layouts/app';
import { Routes } from '@/config/routes';
import { Config } from '@/config';

const AdminDashboard = dynamic(() => import('@/components/dashboard/admin'));
const OwnerDashboard = dynamic(() => import('@/components/dashboard/owner'));

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  if (
    userPermissions.some((permission) =>
      [DEALER, STAFF, STORE_OWNER, SUPER_ADMIN, ADMIN].includes(permission)
    )
  ) {
    return <AdminDashboard />;
  }
  return <OwnerDashboard />;
}

Dashboard.Layout = AppLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  // TODO: Improve it
  const generateRedirectUrl =
    locale !== Config.defaultLanguage
      ? `/${locale}${Routes.login}`
      : Routes.login;

  const { token, permissions }: any = getAuthCredentials(ctx) || {}
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: generateRedirectUrl,
        permanent: false,
      },
    }
  };
  if (locale) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'table',
          'widgets',
        ])),
        userPermissions: permissions,
      },
    };
  }
  return {
    props: {
      userPermissions: permissions,
    },
  };
};
