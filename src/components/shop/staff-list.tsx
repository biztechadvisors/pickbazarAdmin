import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import Pagination from '@/components/ui/pagination';
import { SortOrder } from '@/types';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { User, MappedPaginatorInfo } from '@/types';
import { AllPermission } from '@/utils/AllPermission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { OWNER } from '@/utils/constants';
import { useMeQuery } from '@/data/user';

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

  const { permissions } = getAuthCredentials();
  const permissionTypes = AllPermission(); 

  const canWrite =
  permissionTypes.includes('sidebar-nav-item-users') ||
  permissions?.[0] === OWNER;

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
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 60,
    },
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
      ...(canWrite
        ? {
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
                    // editModalView={true}
                    editUrl='/user-details'
                  // showAddWalletPoints={true}
                  // showMakeAdminButton={true}
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
