import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import Pagination from '@/components/ui/pagination';
import { SortOrder } from '@/types';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { User, MappedPaginatorInfo } from '@/types';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { siteSettings } from '@/settings/site.settings';

type IProps = {
  staffs: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const StaffList = ({
  staffs,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [getPermission,_]=useAtom(newPermission)
  const { permissions } = getAuthCredentials();
  const canWrite =  permissions.includes('super_admin')
  ? siteSettings.sidebarLinks
  :getPermission?.find(
   (permission) => permission.type === 'sidebar-nav-item-staffs'
 )?.write;

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: t('table:table-item-email'),
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (is_active: boolean) =>
        is_active ? t('common:text-active') : t('common:text-inactive'),
    },
    {
        ...(canWrite
        ?{
        title: t('table:table-item-actions'),
        dataIndex: 'id',
        key: 'actions',
        align: alignRight,
        render: (id: string) => {
          return <ActionButtons id={id} deleteModalView="DELETE_STAFF" />;
        },
      } : null),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={staffs!}
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
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default StaffList;
