import { Table } from '@/components/ui/table';
import { SortOrder, Type } from '@/types';
import { getIcon } from '@/utils/get-icon';
import * as typeIcons from '@/components/icons/type';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Button from '../ui/button';
import { getAuthCredentials } from '@/utils/auth-utils';
import { AllPermission } from '@/utils/AllPermission';
import Pagination from '@/components/ui/pagination';


export type IProps = {
  users: any[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  // allDealer : any[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const DealerList = ({ 
  users, 
  paginatorInfo,
  onPagination,
  onSort, 
  onOrder }: IProps) => {

  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const { permissions } = getAuthCredentials();
const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-dealerlist');

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
      align: 'center',
      width: 60,
    },

    // {
    //   title: t('table:table-item-icon'),
    //   dataIndex: 'icon',
    //   key: 'profile',
    //   align: 'center',
    //   render: (icon: string) => {
    //     if (!icon) return null;
    //     return (
    //       <span className="flex items-center justify-center">
    //         {getIcon({
    //           iconList: typeIcons,
    //           iconName: icon,
    //           className: 'w-5 h-5 max-h-full max-w-full',
    //         })}
    //       </span>
    //     );
    //   },
    // },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-email')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'email'
          }
          isActive={sortingObj.column === 'email'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('email'),
      render: (email: any) => <span className="whitespace-nowrap">{email}</span>,
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-walletbalance')}
          ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'walletPoints'}
          isActive={sortingObj.column === 'walletPoints'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'dealer',
      key: 'dealer',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('walletPoints'),
      render: (dealer: any) => <span className="whitespace-nowrap">{dealer ? dealer.walletBalance : 0}</span>,
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
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          slug={record.id}
          record={record}
          deleteModalView="DELETE_DEALER"
          routes={Routes?.dealerlist}
        />
      ),
    },
  ];

  return (
    <>
    <div className="mb-8 overflow-hidden rounded shadow">
      <Table
        //@ts-ignore
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={users}
        rowKey="id"
        scroll={{ x: 380 }}
      />
    </div>
     {!!paginatorInfo?.total && (
      <div className="flex items-center justify-end">
        <Pagination
          total={paginatorInfo.total}
          current={paginatorInfo.currentPage}
          // pageSize={paginatorInfo.perPage}
          onChange={onPagination}
        />
      </div>
    )}
    </>
  );
};

export default DealerList;
