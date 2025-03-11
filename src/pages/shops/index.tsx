import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@/components/shop/shop-list';
import { useState } from 'react';
import Search from '@/components/common/search';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  ownerAndStaffOnly,
  ownerOnly,
} from '@/utils/auth-utils';
import { useShopsQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import permission from '../permission';
import OwnerLayout from '@/components/layouts/owner';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import { OWNER,STAFF, ADMIN } from '@/utils/constants';
import PermissionComponent from '../permission';
import AdminLayout from '@/components/layouts/admin';
import { useMeQuery, useUserQuery } from '@/data/user';


export default function AllShopPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { permissions } = getAuthCredentials();

  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
  });
  
 // Constants for permissions
const OWNER = "Owner"; // Replace with the actual value in your permissions array
const STAFF = "Staff"; // Replace with the actual value in your permissions array

// Fetch current user data
const { data: meData, isLoading: meLoading, error: meError } = useMeQuery();
const createdById = meData?.createdBy?.id; // Get the createdBy user ID

// Fetch the createdBy user's data
const { data: createdByUser, isLoading: createdByLoading, error: createdByError } = useUserQuery(
  { id: createdById },
  { enabled: !!createdById }  
);

console.log("createdByUser*****", createdByUser); 
if (meLoading || createdByLoading) {
  return <Loader text={t('common:text-loading')} />;  
}

if (meError || createdByError) {
  return <ErrorMessage message="Error loading user data" />; 
}

// Determine if the staff member is created by an owner
const createdByRole = createdByUser?.permission?.type_name; 
const isCreatedByOwner = createdByRole === OWNER; 

const canWrite =
  permissions?.includes(OWNER) || // Owners can write
  (permissions?.includes(STAFF) && isCreatedByOwner); // Staff members created by an owner can write

console.log("canWrite****", canWrite);

  // const canWrite = permissions?.includes(OWNER) || permissions?.includes(STAFF);
  // // const canWrite = permissions?.includes(OWNER); 
  
  // if (loading) return <Loader text={t('common:text-loading')} />;
  // if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }


  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-shops')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          {/* {hasAccess(adminAndOwnerOnly, permissions) && ( */}
          <div className="flex w-full items-center">
            <Search onSearch={handleSearch} />
            {canWrite ? (
              <LinkButton
                href={Routes.shop.create}
                className="h-12 ms-4 md:ms-6"
              >
                <span className="hidden md:block">
                  {t('text-create-company')}
                </span>
              </LinkButton>
            ) : null}
          </div>
        </div>
      </Card>
      <ShopList
        shops={shops}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
AllShopPage.authenticate = {
  // permissions: adminAndOwnerOnly,
  permissions: ownerAndStaffOnly,
};

AllShopPage.Layout =
  getAuthCredentials().permissions?.[0] === OWNER
    ? OwnerLayout
    : AdminLayout;
// AllShopPage.Layout = OwnerLayout;


export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
