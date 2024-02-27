
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import Link from 'next/link';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { siteSettings } from '@/settings/site.settings';
import { usePermissionData } from '@/data/permission';
import { useUpdateCart } from '@/data/cart';
export default function Permission() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [getPermission, _] = useAtom(newPermission);
  const { permissions } = getAuthCredentials();
  const canWrite = permissions.includes('super_admin')
    ? siteSettings.sidebarLinks
    : getPermission?.find(
      (permission) => permission.type === 'sidebar-nav-item-permission'
    )?.write;

  const {
    isLoading,
    error,
    data: permissionData,
    refetch,
  } = usePermissionData();

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={permissionData.error.message} />;
  if (!permissionData) {
    return <div>No permission data available</div>;
  }

  // console.log('permissionData', permissionData)
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">
            Permissions
          </h1>
        </div>

        <div className="ms-auto flex w-full flex-col items-center md:w-1/2 md:flex-row gap-x-5">
          <Search onSearch={handleSearch} />
          {canWrite ? (
            <LinkButton href="/permission/create">Create Permission</LinkButton>
          ) : null}
        </div>
      </Card>

      <div className="order-2 col-span-12 sm:col-span-6 xl:order-1 xl:col-span-4 3xl:col-span-3">
        <div className="flex flex-col items-center rounded bg-white px-6 py-8">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">ROLE</th>
                <th className="border p-2">NAME</th>
                <th className="border p-2">PERMISSION-TYPE</th>
                {canWrite ? (
                  <th className="border p-2">ACTIONS</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {permissionData.map((e, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{e.type_name}</td>
                  <td className="border p-2">{e.permission_name}</td>
                  <td className="border p-2">
                    {e.permissions.length > 0
                      ? e.permissions.slice(0, 3).map((permission, i) => (
                        <React.Fragment key={i}>
                          <li>
                            {permission.type
                              .replace('sidebar-nav-item-', '')
                              .charAt(0)
                              .toUpperCase() +
                              permission.type
                                .replace('sidebar-nav-item-', '')
                                .slice(1)}
                          </li>
                          {i !== e.permissions.length - 1 && ' '}
                        </React.Fragment>
                      ))
                      : ''}
                  </td>
                  {canWrite ? (
                    <td className="border p-2">
                      <td className="border p-2">
                        <Link href={`/permission/create?id=${e.id}`}>
                          <button className="text-blue-500 hover:underline flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            <span>View</span>
                          </button>
                        </Link>

                      </td>

                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Permission.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
