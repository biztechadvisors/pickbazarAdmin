import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddStaffForm from '@/components/shop/staff-form';
import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery, useUsersQuery } from '@/data/user'; // Updated import
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/admin';
import OwnerLayout from '@/components/layouts/owner';
import { OWNER } from '@/utils/constants';
import { usePermissionData } from '@/data/permission';
import { PermissionsProps } from '@/types';
import Loader from '@/components/ui/loader/loader';

export default function AddStaffPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop, id }, // Get staff ID from query if editing
  } = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const { data: permissionData, isLoading } = usePermissionData();

  // Fetch user data if in edit mode using useUsersQuery
  const { data: usersData, isLoading: loadingUsers } = useUsersQuery(
    {
      id: id as string,
      limit: 1, // We only need one user
    },
    {
      enabled: !!id, // Only fetch if id exists
    }
  );

  if (isLoading || loadingUsers) return <Loader />;

  const shopId = shopData?.id!;
  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  // Get default values for edit mode
  const defaultValue = permissionData?.filter(
    (permission: PermissionsProps) => permission.id === 186
  )[0]?.permission_name;

  const defaultPermission = permissionData?.filter(
    (permission: PermissionsProps) => permission.id === 186
  )[0]?.permissions;

  // Extract the user data from usersQuery response
  const userData = usersData?.users?.[0];

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {id ? t('Edit Staff') : t('Create Staff')}
        </h1>
      </div>
      <AddStaffForm
        defaultVal={defaultValue}
        defaultPermissions={defaultPermission}
        initialValues={userData} // Pass user data for edit mode
      />
    </>
  );
}

const { permissions } = getAuthCredentials();
const resLayout = () => {
  return permissions?.[0] === OWNER ? OwnerLayout : AdminLayout;
};

AddStaffPage.Layout = resLayout();

AddStaffPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});