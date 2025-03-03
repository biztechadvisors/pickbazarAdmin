// import dynamic from 'next/dynamic';
// import type { GetServerSideProps } from 'next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import {
//   allowedRoles,
//   getAuthCredentials,
//   hasAccess,
//   isAuthenticated,
// } from '@/utils/auth-utils';
// import { ADMIN, DEALER, STAFF, Company, SUPER_ADMIN } from '@/utils/constants';
// import AppLayout from '@/components/layouts/app';
// import { Routes } from '@/config/routes';
// import { Config } from '@/config';

// const AdminDashboard = dynamic(() => import('@/components/dashboard/admin'));
// const OwnerDashboard = dynamic(() => import('@/components/dashboard/owner'));

// export default function Dashboard({
//                                     userPermissions,
//                                   }: {
//   userPermissions: string[];
// }) {
//   console.log("Permission",userPermissions);
//   if (
//     userPermissions.some((permission) =>
//       [DEALER, STAFF, Company, SUPER_ADMIN, ADMIN].includes(permission)
//     )
//   ) {
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

//   const { token, permissions }: any = getAuthCredentials(ctx) || {};
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
import { ADMIN, DEALER, STAFF, Company, SUPER_ADMIN, OWNER } from '@/utils/constants';
import AppLayout from '@/components/layouts/app';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { useMeQuery } from '@/data/user'; // Fetch current user data
import { useUserQuery } from '@/data/user'; // Fetch createdBy user data

const AdminDashboard = dynamic(() => import('@/components/dashboard/admin'));
const OwnerDashboard = dynamic(() => import('@/components/dashboard/owner'));

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const { data: meData, isLoading: meLoading, error: meError } = useMeQuery(); // Fetch current user data
  const createdById = meData?.createdBy?.id; // Get the createdBy user ID

  // Fetch the createdBy user's data
  const { data: createdByUser, isLoading: createdByLoading, error: createdByError } = useUserQuery(
    { id: createdById },
    { enabled: !!createdById } // Only fetch if createdById exists
  );

  if (meLoading || createdByLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (meError || createdByError) {
    return <div>Error loading user data</div>; // Handle errors
  }
  const userRole = meData?.permission?.type_name;
  if (userRole === 'Company') {
    return <AdminDashboard />;
  }
  // Determine the dashboard based on the createdBy user's role
  const createdByRole = createdByUser?.permission?.type_name; // Assuming role is stored in permission.type_name
  const isCreatedByOwner = createdByRole === 'Owner'; // Replace 'Owner' with the actual role name
  const isCreatedByAdmin = createdByRole === 'Admin'; // Replace 'Admin' with the actual role name

  
  if (isCreatedByOwner) {
    return <OwnerDashboard />; // Show Owner Dashboard if created by Owner
  } else if (isCreatedByAdmin) {
    return <AdminDashboard />; // Show Admin Dashboard if created by Admin
  }

  // Fallback to default logic based on permissions
  if (
    userPermissions.some((permission) =>
      [DEALER, STAFF, Company, SUPER_ADMIN, ADMIN].includes(permission)
  )) {
    return <AdminDashboard />;
  }
  return <OwnerDashboard />;
}

Dashboard.Layout = AppLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const generateRedirectUrl =
    locale !== Config.defaultLanguage
      ? `/${locale}${Routes.login}`
      : Routes.login;

  const { token, permissions }: any = getAuthCredentials(ctx) || {};
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: generateRedirectUrl,
        permanent: false,
      },
    };
  }
  if (locale) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'table', 'widgets'])),
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