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
import { getAuthCredentials } from '@/utils/auth-utils';
import { OWNER } from '@/utils/constants';
import { filter } from 'lodash';
import { CUSTOMER } from '@/lib/constants';

type IProps = {
  customers: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CustomerList = ({
  customers,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const { permissions } = getAuthCredentials();
  const permissionTypes = AllPermission();
  const canWrite =
    permissionTypes.includes('sidebar-nav-item-users') ||
    permissions?.[0] === OWNER;

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
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 60,
    },
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
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (type: any, record: any) => {
        return <div>{type?.type_name}</div>;
      },
    },
    {
      title: t('table:table-item-available_wallet_points'),
      dataIndex: 'walletPoints',
      key: 'walletPoints',
      align: 'center',
      render: (walletPoints: any, record: any) => {
        return <div>{walletPoints}</div>;
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
  const filteredCustomers = customers?.filter(
    (customer) => customer.permission?.type_name === CUSTOMER // Adjust the condition as needed
  );
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={customers}
          // data={filteredCustomers}
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

export default CustomerList;
