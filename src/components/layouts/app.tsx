import {
  ADMIN,
  DEALER,
  STAFF,
  Company,
  SUPER_ADMIN,
  OWNER,
} from '@/utils/constants';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (
    userPermissions?.some((permission) =>
      [DEALER, STAFF, Company, SUPER_ADMIN, ADMIN].includes(permission)
    )
  ) {
    return <AdminLayout {...props} />;
  } else if (
    userPermissions?.some((permission) => [OWNER].includes(permission))
  ) {
    return <OwnerLayout {...props} />;
  }
}
