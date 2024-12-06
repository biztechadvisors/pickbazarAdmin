import Card from '@/components/common/card';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import StaffList from '@/components/staff/staff-list';
import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
  ownerOnly,
} from '@/utils/auth-utils';
import ErrorMessage from '@/components/ui/error-message';
import { useShopQuery } from '@/data/shop';
import { useStaffsQuery } from '@/data/staff';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { Routes } from '@/config/routes';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { AllPermission } from '@/utils/AllPermission';
import AdminLayout from '@/components/layouts/admin';
import OwnerLayout from '@/components/layouts/owner';
import { STAFF } from '@/utils/constants';
import Search from '@/components/common/search';

export default function StaffsPage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const {
    query: { shop },
  } = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');

  const shopSlug =
    typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-staffs');

  const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
    slug: shopSlug as string,
  });
  const { data } = useMeQuery();
  const shopId = shopData?.id!;
  const { users, paginatorInfo, loading, error } = useUsersQuery({
    // limit: 20,
    usrById: data?.id,
    email: searchTerm,
    limit: 10,  
    page: page,
    name: searchTerm,
    // orderBy,
    // sortedBy,
    role: 'user',
  });

  console.log('data?.id', data?.id);
  console.log('users', users);

  // const {
  //   staffs,
  //   paginatorInfo,
  //   loading: loading,
  //   error,
  // } = useStaffsQuery(
  //   {
  //     limit: 20,
  //     usrById: me?.id,
  //     email: searchTerm,
  //     page,
  //     name: searchTerm,
  //     shop_id: shopId,
  //     page,
  //     orderBy,
  //     sortedBy,
  //   },
  //   {
  //     enabled: Boolean(shopId),
  //   }
  // ); 
  if (fetchingShopId || loading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error?.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  const filteredUsers = users?.filter(
    (user) => user.permission?.type_name === STAFF
  );
console.log("filteredUsers",filteredUsers)

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  return (
    <>
      <Card className="mb-8 flex flex-row items-center justify-between">
        <div className="md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">
            {t('form:text-staff')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <div className="flex w-full items-center">
            <Search onSearch={handleSearch} />
            <LinkButton
              href={`${Routes.staff.create}`}
              className="h-12 ms-4 md:ms-6"
            >
              <span>+ {t('form:button-label-add-staff')}</span>
            </LinkButton>
          </div>
        </div>
      </Card>

      <StaffList
        staffs={users}
        onPagination={handlePagination}
        paginatorInfo={paginatorInfo}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
StaffsPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
StaffsPage.Layout = OwnerLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
