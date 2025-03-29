import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { siteSettings } from '@/settings/site.settings';
import {
  Category,
  MappedPaginatorInfo,
  SortOrder,
  User,
  UserPaginator,
} from '@/types';
import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { AllPermission } from '@/utils/AllPermission';
import { Routes } from '@/config/routes';

type IProps = {
  // customers: User[] | undefined;
  staffs: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const StaffList = ({
  // customers,
  staffs,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-users');

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );

      onOrder(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-avatar'),
      dataIndex: 'profile',
      key: 'profile',
      align: 'center',
      width: 74,
      render: (profile: any, record: any) => (
        <Image
          src={profile?.avatar?.thumbnail ?? siteSettings.avatar.placeholder}
          alt={record?.name}
          width={42}
          height={42}
          className="overflow-hidden rounded"
        />
      ),
    },
    {
      title: t('table:table-item-title'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
    },
    {
      title: t('table:table-item-email'),
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
    },
    {
      title: t('table:table-item-permissions'),
      dataIndex: 'permission',
      key: 'permission',
      align: 'center',
      render: (permission: any, record: any) => {
        return (
          <div>
            {permission?.permission_name}
          </div>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => (is_active ? 'Active' : 'Inactive'),
    },
    {
      ...(canWrite ?
        {
          title: t('table:table-item-actions'),
          dataIndex: 'id',
          key: 'actions',
          align: 'right',
          render: function Render(id: string, { is_active }: any) {
            const { data } = useMeQuery();
            return (
              <>
                {data?.id != id && (
                  <ActionButtons
                    id={id}
                    userStatus={true}
                    isUserActive={is_active}
                    editUrl={`${Routes.staff.create}?id=${id}`}
                    // showAddWalletPoints={true}
                    showMakeAdminButton={true}
                  />
                )}
              </>
            );
          },
        }
        : null),
    },

  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={staffs}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default StaffList;
