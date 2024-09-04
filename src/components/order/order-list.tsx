// import Pagination from '@/components/ui/pagination';
// import dayjs from 'dayjs';
// import { Table } from '@/components/ui/table';
// import ActionButtons from '@/components/common/action-buttons';
// import usePrice from '@/utils/use-price';
// import { formatAddress } from '@/utils/format-address';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import { SortOrder, UserAddress } from '@/types';
// import { useTranslation } from 'next-i18next';
// import { useIsRTL } from '@/utils/locals';
// import { useState } from 'react';
// import TitleWithSort from '@/components/ui/title-with-sort';
// import { Order, MappedPaginatorInfo } from '@/types';
// import { useRouter } from 'next/router';
// import StatusColor from '@/components/order/status-color';
// import Badge from '@/components/ui/badge/badge';
// import Button from '@/components/ui/button';
// import { Routes } from '@/config/routes';
// import { ChatIcon } from '@/components/icons/chat';
// import { useCreateConversations } from '@/data/conversations';
// import { SUPER_ADMIN } from '@/utils/constants';
// import { getAuthCredentials } from '@/utils/auth-utils';
// import { useAtom } from 'jotai';
// import { siteSettings } from '@/settings/site.settings';
// import { newPermission } from '@/contexts/permission/storepermission';
// import { AllPermission } from '@/utils/AllPermission';

// type IProps = {
//   orders: Order[] | undefined;
//   paginatorInfo: MappedPaginatorInfo | null;
//   onPagination: (current: number) => void;
//   onSort: (current: any) => void;
//   onOrder: (current: string) => void;
// };

// const OrderList = ({
//   orders,
//   paginatorInfo,
//   onPagination,
//   onSort,
//   onOrder,
//   Shop,
// }: IProps) => {

//   console.log("orders",orders)
//   console.log("ShopShow",Shop)
//   // const { data, paginatorInfo } = orders! ?? {};

//   const router = useRouter();
//   const { t } = useTranslation();
//   const rowExpandable = (record: any) => record.children?.length;
//   const { alignLeft } = useIsRTL();
//   const { permissions } = getAuthCredentials();
//   const { mutate: createConversations, isLoading: creating } =
//     useCreateConversations();
//   const [loading, setLoading] = useState<boolean | string | undefined>(false);
//   const [sortingObj, setSortingObj] = useState<{
//     sort: SortOrder;
//     column: string | null;
//   }>({
//     sort: SortOrder.Desc,
//     column: null,
//   });

 

//   const permissionTypes = AllPermission();

//   const canWrite = permissionTypes.includes('sidebar-nav-item-orders');

//   const onSubmit = async (shop_id: string | undefined) => {
//     setLoading(shop_id);
//     createConversations({
//       // @ts-ignore
//       shop_id,
//       via: 'admin',
//     });
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
//       title: t('table:table-item-id'),
//       dataIndex: 'id',
//       key: 'id',
//       align: 'center',
//       width: 60,
//     },
//     {
//       title: t('table:table-item-tracking-number'),
//       dataIndex: 'tracking_number',
//       key: 'tracking_number',
//       align: 'center',
//       width: 150,
//     },
//     {
//       title: t('table:table-item-delivery-fee'),
//       dataIndex: 'delivery_fee',
//       key: 'delivery_fee',
//       align: 'center',
//       render: function Render(value: any) {
//         const delivery_fee = value ? value : 0;
//         const { price } = usePrice({
//           amount: delivery_fee,
//         });
//         return <span>{price}</span>;
//       },
//     },
//     {
//       title: (
//         <TitleWithSort
//           title={t('table:table-item-total')}
//           ascending={
//             sortingObj.sort === SortOrder.Asc && sortingObj.column === 'total'
//           }
//           isActive={sortingObj.column === 'total'}
//         />
//       ),
//       className: 'cursor-pointer',
//       dataIndex: 'total',
//       key: 'total',
//       align: 'center',
//       width: 120,
//       onHeaderCell: () => onHeaderClick('total'),
//       render: function Render(value: any) {
//         const { price } = usePrice({
//           amount: value,
//         });
//         return <span className="whitespace-nowrap">{price}</span>;
//       },
//     },

//     if (Shop){

//        {
//       title: (
//         <TitleWithSort
//           title={t('table:table-item-order-date')}
//           ascending={
//             sortingObj.sort === SortOrder.Asc &&
//             sortingObj.column === 'created_at'
//           }
//           isActive={sortingObj.column === 'created_at'}
//         />
//       ),
//       className: 'cursor-pointer',
//       dataIndex: 'created_at',
//       key: 'created_at',
//       align: 'center',
//       onHeaderCell: () => onHeaderClick('created_at'),
//       render: (date: string) => {
//         dayjs.extend(relativeTime);
//         dayjs.extend(utc);
//         dayjs.extend(timezone);
//         return (
//           <span className="whitespace-nowrap">
//             {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
//           </span>
//         );
//       },
//     },

    
//     {
//       title: t('table:table-item-status'),
//       dataIndex: 'order_status',
//       key: 'order_status',
//       align: alignLeft,
//       render: (order_status: string) => (
//         <Badge text={t(order_status)} color={StatusColor(order_status)} />
//       ),
//     },

//     }
//     else {
//       {
//         title: (
//           <TitleWithSort
//             title={t('table:table-item-order-date')}
//             ascending={
//               sortingObj.sort === SortOrder.Asc &&
//               sortingObj.column === 'status.created_at'
//             }
//             isActive={sortingObj.column === 'status.created_at'}
//           />
//         ),
//         className: 'cursor-pointer',
//         dataIndex: 'status',
//         key: 'status.created_at',
//         align: 'center',
//         onHeaderCell: () => onHeaderClick('status.created_at'),
//         render: (status: { created_at: string }) => {
//           if (!status || !status.created_at) return null;
//           dayjs.extend(relativeTime);
//           dayjs.extend(utc);
//           dayjs.extend(timezone);
//           return (
//             <span className="whitespace-nowrap">
//               {dayjs.utc(status.created_at).tz(dayjs.tz.guess()).fromNow()}
//             </span>
//           );
//         },
//       },
      
//       {
//         title: t('table:table-item-status'),
//         dataIndex: 'status',
//         key: 'status.name',
//         align: 'left',
//         render: (status: { name: string } | null) =>
//           status ? (
//             <Badge text={t(status.name)} color={StatusColor(status.name)} />
//           ) : (
//             <Badge text={t('unknown')} color={StatusColor('unknown')} />
//           ),
//       },
//     }
    
//     // {
//     //   title: (
//     //     <TitleWithSort
//     //       title={t('table:table-item-order-date')}
//     //       ascending={
//     //         sortingObj.sort === SortOrder.Asc &&
//     //         sortingObj.column === 'created_at'
//     //       }
//     //       isActive={sortingObj.column === 'created_at'}
//     //     />
//     //   ),
//     //   className: 'cursor-pointer',
//     //   dataIndex: 'created_at',
//     //   key: 'created_at',
//     //   align: 'center',
//     //   onHeaderCell: () => onHeaderClick('created_at'),
//     //   render: (date: string) => {
//     //     dayjs.extend(relativeTime);
//     //     dayjs.extend(utc);
//     //     dayjs.extend(timezone);
//     //     return (
//     //       <span className="whitespace-nowrap">
//     //         {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
//     //       </span>
//     //     );
//     //   },
//     // },

    
//     // {
//     //   title: t('table:table-item-status'),
//     //   dataIndex: 'order_status',
//     //   key: 'order_status',
//     //   align: alignLeft,
//     //   render: (order_status: string) => (
//     //     <Badge text={t(order_status)} color={StatusColor(order_status)} />
//     //   ),
//     // },

//     // {
//     //   title: (
//     //     <TitleWithSort
//     //       title={t('table:table-item-order-date')}
//     //       ascending={
//     //         sortingObj.sort === SortOrder.Asc &&
//     //         sortingObj.column === 'status.created_at'
//     //       }
//     //       isActive={sortingObj.column === 'status.created_at'}
//     //     />
//     //   ),
//     //   className: 'cursor-pointer',
//     //   dataIndex: 'status',
//     //   key: 'status.created_at',
//     //   align: 'center',
//     //   onHeaderCell: () => onHeaderClick('status.created_at'),
//     //   render: (status: { created_at: string }) => {
//     //     if (!status || !status.created_at) return null;
//     //     dayjs.extend(relativeTime);
//     //     dayjs.extend(utc);
//     //     dayjs.extend(timezone);
//     //     return (
//     //       <span className="whitespace-nowrap">
//     //         {dayjs.utc(status.created_at).tz(dayjs.tz.guess()).fromNow()}
//     //       </span>
//     //     );
//     //   },
//     // },
    
//     // {
//     //   title: t('table:table-item-status'),
//     //   dataIndex: 'status',
//     //   key: 'status.name',
//     //   align: 'left',
//     //   render: (status: { name: string } | null) =>
//     //     status ? (
//     //       <Badge text={t(status.name)} color={StatusColor(status.name)} />
//     //     ) : (
//     //       <Badge text={t('unknown')} color={StatusColor('unknown')} />
//     //     ),
//     // },

    
//     {
//       title: t('table:table-item-shipping-address'),
//       dataIndex: 'shipping_address',
//       key: 'shipping_address',
//       align: alignLeft,
//       render: (shipping_address: UserAddress) => (
//         <div>{formatAddress(shipping_address)}</div>
//       ),
//     },
//     {
//       title: t('table:table-item-actions'),
//       dataIndex: 'id',
//       key: 'actions',
//       align: 'center',
//       width: 220,
//       render: (id: string, order: Order) => {
//         const currentButtonLoading = !!loading && loading === order?.shop_id;
//         return canWrite ? (
//           <>
//             {/* @ts-ignore */}
//             {order?.children?.length ? (
//               ''
//             ) : (
//               <>
//                 {permissions?.includes(SUPER_ADMIN) && order?.shop_id ? (
//                   <button
//                     onClick={() => onSubmit(order?.shop_id)}
//                     disabled={currentButtonLoading}
//                     className="cursor-pointer text-accent transition-colors duration-300 hover:text-accent-hover"
//                   >
//                     <ChatIcon width="19" height="20" />
//                   </button>
//                 ) : (
//                   ''
//                 )}
//               </>
//             )}
//             <ActionButtons
//               id={id}
//               detailsUrl={`${Routes.singleorder}/${id}`}
//               customLocale={order.language}
//             />
//           </>
//         ) : null;
//       },
//     },
//   ];

//   return (
//     <>
//       <div className="mb-6 overflow-hidden rounded shadow">
//         <Table
//           //@ts-ignore
//           columns={columns}
//           emptyText={t('table:empty-table-data')}
//           data={orders}
//           rowKey="id"
//           scroll={{ x: 1000 }}
//           expandable={{
//             expandedRowRender: () => '',
//             rowExpandable: rowExpandable,
//           }}
//         />
//       </div>

//       {!!paginatorInfo?.total && (
//         <div className="flex items-center justify-end">
//           <Pagination
//             total={paginatorInfo?.total}
//             current={paginatorInfo?.currentPage}
//             pageSize={paginatorInfo?.perPage}
//             onChange={onPagination}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderList;



import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SortOrder, UserAddress } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Order, MappedPaginatorInfo } from '@/types';
import { useRouter } from 'next/router';
import StatusColor from '@/components/order/status-color';
import Badge from '@/components/ui/badge/badge';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import { ChatIcon } from '@/components/icons/chat';
import { useCreateConversations } from '@/data/conversations';
import { Company, SUPER_ADMIN } from '@/utils/constants';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useAtom } from 'jotai';
import { siteSettings } from '@/settings/site.settings';
import { newPermission } from '@/contexts/permission/storepermission';
import { AllPermission } from '@/utils/AllPermission';
import { useMeQuery } from '@/data/user';

type IProps = {
  orders: Order[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  Shop: boolean;
};

const OrderList = ({
  orders,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  
}: IProps) => {
  console.log('orders@@@', orders);

  // const { data, paginatorInfo } = orders! ?? {};
  const { data: me } = useMeQuery(); 

  const Shop = me?.permission.type_name === Company;
  console.log('ShopShow', Shop);

  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft } = useIsRTL();
  const { permissions } = getAuthCredentials();
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();
  const [loading, setLoading] = useState<boolean | string | undefined>(false);
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-orders');

  const onSubmit = async (shop_id: string | undefined) => {
    setLoading(shop_id);
    createConversations({
      // @ts-ignore
      shop_id,
      via: 'admin',
    });
  };

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

  const commonColumns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 60,
    },
    {
      title: t('table:table-item-tracking-number'),
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: 'center',
      width: 150,
    },
    {
      title: t('table:table-item-delivery-fee'),
      dataIndex: 'delivery_fee',
      key: 'delivery_fee',
      align: 'center',
      render: function Render(value: any) {
        const delivery_fee = value ? value : 0;
        const { price } = usePrice({
          amount: delivery_fee,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-total')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'total'
          }
          isActive={sortingObj.column === 'total'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('total'),
      render: function Render(value: any) {
        const { price } = usePrice({
          amount: value,
        });
        return <span className="whitespace-nowrap">{price}</span>;
      },
    },
  ];

  const shopColumns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-order-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'order_status',
      key: 'order_status',
      align: alignLeft,
      render: (order_status: string) => (
        <Badge text={t(order_status)} color={StatusColor(order_status)} />
      ),
    },
  ];

  const nonShopColumns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-order-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'status.created_at'
          }
          isActive={sortingObj.column === 'status.created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status.created_at',
      align: 'center',
      onHeaderCell: () => onHeaderClick('status.created_at'),
      render: (status: { created_at: string }) => {
        if (!status || !status.created_at) return null;
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(status.created_at).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status.name',
      align: 'left',
      render: (status: { name: string } | null) =>
        status ? (
          <Badge text={t(status.name)} color={StatusColor(status.name)} />
        ) : (
          <Badge text={t('unknown')} color={StatusColor('unknown')} />
        ),
    },
  ];

  const columns = Shop
    ? [...commonColumns, ...shopColumns]
    : [...commonColumns, ...nonShopColumns];

  columns.push(
    {
      title: t('table:table-item-shipping-address'),
      dataIndex: 'shipping_address',
      key: 'shipping_address',
      align: alignLeft,
      render: (shipping_address: UserAddress) => (
        <div>{formatAddress(shipping_address)}</div>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 220,
      render: (id: string, order: Order) => {
        const currentButtonLoading = !!loading && loading === order?.shop_id;
        return canWrite ? (
          <>
            {/* @ts-ignore */}
            {order?.children?.length ? (
              ''
            ) : (
              <>
                {permissions?.includes(SUPER_ADMIN) && order?.shop_id ? (
                  <button
                    onClick={() => onSubmit(order?.shop_id)}
                    disabled={currentButtonLoading}
                    className="cursor-pointer text-accent transition-colors duration-300 hover:text-accent-hover"
                  >
                    <ChatIcon width="19" height="20" />
                  </button>
                ) : (
                  ''
                )}
              </>
            )}
            <ActionButtons
              id={id}
              detailsUrl={`${Routes.singleorder}/${id}`}
              customLocale={order.language}
            />
          </>
        ) : null;
      },
    }
  );

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={orders}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderList;
