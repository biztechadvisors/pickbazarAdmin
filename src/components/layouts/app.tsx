// import { DEALER, STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
// import dynamic from 'next/dynamic';

// const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
// const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

// export default function AppLayout({
//   userPermissions,
//   ...props
// }: {
//   userPermissions: string[];
// }) {
//   if (userPermissions?.includes(DEALER)) {
//     return <AdminLayout {...props} />;
//   }
//   return <OwnerLayout {...props} />;
// }



import { DEALER, STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
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
    userPermissions?.some(permission =>
      [DEALER, STAFF, STORE_OWNER, SUPER_ADMIN].includes(permission)
    )
  ) {
    return <AdminLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}
