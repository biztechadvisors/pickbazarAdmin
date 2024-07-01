import { useState } from 'react';
import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import Badge from '@/components/ui/badge/badge';
import { SortOrder } from '@/types';
import TitleWithSort from '@/components/ui/title-with-sort';
import Link from '@/components/ui/link';
import { Shop, MappedPaginatorInfo } from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { AllPermission } from '@/utils/AllPermission';
import { OWNER } from '@/utils/constants';

type IProps = {
  shops: Shop[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const ShopList = ({
  shops,
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
    permissionTypes.includes('sidebar-nav-item-shops') ||
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
      title: t('table:table-item-logo'),
      dataIndex: 'logo',
      key: 'logo',
      align: 'center',
      width: 74,
      render: (logo: any, record: any) => (
        <Image
          src={logo?.thumbnail ?? siteSettings.product.placeholder}
          alt={record?.name}
          width={42}
          height={42}
          className="overflow-hidden rounded"
        />
      ),
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
      render: (name: any, { slug }: any) => (
        <Link href={`/${slug}`}>
          <span className="whitespace-nowrap">{name}</span>
        </Link>
      ),
    },
    {
      title: t('table:table-item-owner-name'),
      dataIndex: 'owner',
      key: 'owner',
      align: 'center',
      render: (owner: any) => owner.name,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-total-products')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'products_count'
          }
          isActive={sortingObj.column === 'products_count'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'products_count',
      key: 'products_count',
      align: 'center',
      onHeaderCell: () => onHeaderClick('products_count'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-total-orders')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'orders_count'
          }
          isActive={sortingObj.column === 'orders_count'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'orders_count',
      key: 'orders_count',
      align: 'center',
      onHeaderCell: () => onHeaderClick('orders_count'),
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
      render: (is_active: boolean) => (
        <Badge
          textKey={is_active ? 'common:text-active' : 'common:text-inactive'}
          color={is_active ? 'bg-accent' : 'bg-red-500'}
        />
      ),
    },
    {
      ...(canWrite
        ? {
          title: t('table:table-item-actions'),
          dataIndex: 'id',
          key: 'actions',
          align: alignRight,
          render: (id: string, { slug, is_active }: any) => {
            return (
              <ActionButtons
                id={id}
                approveButton={true}
                detailsUrl={`/${slug}`}
                isShopActive={is_active}
              />
            );
          },
        } : {}),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={shops}
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

export default ShopList;


// import { useState } from 'react';
// import Pagination from '@/components/ui/pagination';
// import Image from 'next/image';
// import { Table } from '@/components/ui/table';
// import ActionButtons from '@/components/common/action-buttons';
// import { siteSettings } from '@/settings/site.settings';
// import { useTranslation } from 'next-i18next';
// import { useIsRTL } from '@/utils/locals';
// import { SortOrder } from '@/types';
// import TitleWithSort from '@/components/ui/title-with-sort';
// import Link from '@/components/ui/link';
// import { Shop, MappedPaginatorInfo } from '@/types';
// import { getAuthCredentials } from '@/utils/auth-utils';
// import { AllPermission } from '@/utils/AllPermission';
// import { OWNER } from '@/utils/constants';
// import ToggleButton from '@/components/layouts/navigation/ToggleButton';

// type IProps = {
//   shops: Shop[] | undefined;
//   paginatorInfo: MappedPaginatorInfo | null;
//   onPagination: (current: number) => void;
//   onSort: (current: any) => void;
//   onOrder: (current: string) => void;
// };

// const ShopList = ({
//   shops,
//   paginatorInfo,
//   onPagination,
//   onSort,
//   onOrder,
// }: IProps) => {
//   const { t } = useTranslation();
//   const { alignLeft, alignRight } = useIsRTL();
//   const { permissions } = getAuthCredentials();
//   const permissionTypes = AllPermission();
//   const canWrite =
//     permissionTypes.includes('sidebar-nav-item-shops') ||
//     permissions?.[0] === OWNER;

//   const [sortingObj, setSortingObj] = useState<{
//     sort: SortOrder;
//     column: string | null;
//   }>({
//     sort: SortOrder.Desc,
//     column: null,
//   });

//   const [toggleStatus, setToggleStatus] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   const handleToggle = (id: string) => {
//     setToggleStatus((prevStatus) => ({
//       ...prevStatus,
//       [id]: !prevStatus[id],
//     }));
//   };

//   const onHeaderClick = (column: string | null) => ({
//     onClick: () => {
//       onSort((currentSortDirection: SortOrder) =>
//         currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
//       );
//       onOrder(column!);

//       setSortingObj({
//         sort:
//           sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
//         column: column,
//       });
//     },
//   });

//   const columns = [
//     {
//       title: t('table:table-item-logo'),
//       dataIndex: 'logo',
//       key: 'logo',
//       align: 'center',
//       width: 74,
//       render: (logo: any, record: any) => (
//         <Image
//           src={logo?.thumbnail ?? siteSettings.product.placeholder}
//           alt={record?.name}
//           width={42}
//           height={42}
//           className="overflow-hidden rounded"
//         />
//       ),
//     },
//     {
//       title: (
//         <TitleWithSort
//           title={t('table:table-item-title')}
//           ascending={
//             sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
//           }
//           isActive={sortingObj.column === 'name'}
//         />
//       ),
//       className: 'cursor-pointer',
//       dataIndex: 'name',
//       key: 'name',
//       align: alignLeft,
//       onHeaderCell: () => onHeaderClick('name'),
//       render: (name: any, { slug }: any) => (
//         <Link href={`/${slug}`}>
//           <span className="whitespace-nowrap">{name}</span>
//         </Link>
//       ),
//     },
//     {
//       title: t('table:table-item-owner-name'),
//       dataIndex: 'owner',
//       key: 'owner',
//       align: 'center',
//       render: (owner: any) => owner.name,
//     },
//     {
//       title: (
//         <TitleWithSort
//           title={t('table:table-item-total-products')}
//           ascending={
//             sortingObj.sort === SortOrder.Asc &&
//             sortingObj.column === 'products_count'
//           }
//           isActive={sortingObj.column === 'products_count'}
//         />
//       ),
//       className: 'cursor-pointer',
//       dataIndex: 'products_count',
//       key: 'products_count',
//       align: 'center',
//       onHeaderCell: () => onHeaderClick('products_count'),
//     },
//     {
//       title: (
//         <TitleWithSort
//           title={t('table:table-item-total-orders')}
//           ascending={
//             sortingObj.sort === SortOrder.Asc &&
//             sortingObj.column === 'orders_count'
//           }
//           isActive={sortingObj.column === 'orders_count'}
//         />
//       ),
//       className: 'cursor-pointer',
//       dataIndex: 'orders_count',
//       key: 'orders_count',
//       align: 'center',
//       onHeaderCell: () => onHeaderClick('orders_count'),
//     },
//     {
//       title: (
//         <TitleWithSort
//           title={t('table:table-item-status')}
//           ascending={
//             sortingObj.sort === SortOrder.Asc &&
//             sortingObj.column === 'is_active'
//           }
//           isActive={sortingObj.column === 'is_active'}
//         />
//       ),
//       className: 'cursor-pointer',
//       dataIndex: 'is_active',
//       key: 'is_active',
//       align: 'center',
//       onHeaderCell: () => onHeaderClick('is_active'),
//       render: (is_active: boolean, record: any) => (
//         <ToggleButton
//           isChecked={toggleStatus[record.id] ?? is_active}
//           handleToggle={() => handleToggle(record.id)}
//         />
//       ),
//     },
//     {
//       ...(canWrite
//         ? {
//             title: t('table:table-item-actions'),
//             dataIndex: 'id',
//             key: 'actions',
//             align: alignRight,
//             render: (id: string, { slug, is_active }: any) => {
//               return (
//                 <ActionButtons
//                   id={id}
//                   approveButton={true}
//                   detailsUrl={`/${slug}`}
//                   isShopActive={is_active}
//                 />
//               );
//             },
//           }
//         : {}),
//     },
//   ];

//   return (
//     <>
//       <div className="mb-6 overflow-hidden rounded shadow">
//         <Table
//           columns={columns}
//           emptyText={t('table:empty-table-data')}
//           data={shops}
//           rowKey="id"
//           scroll={{ x: 800 }}
//         />
//       </div>

//       {!!paginatorInfo?.total && (
//         <div className="flex items-center justify-end">
//           <Pagination
//             total={paginatorInfo.total}
//             current={paginatorInfo.currentPage}
//             pageSize={paginatorInfo.perPage}
//             onChange={onPagination}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default ShopList;
