// import { useTranslation } from 'next-i18next';
// import { Fragment } from 'react';
// import { Tab } from '@headlessui/react';
// import cn from 'classnames';
// import dynamic from 'next/dynamic';
// import { useRouter } from 'next/router';
// import { isEmpty } from 'lodash';
// const ShopList = dynamic(() => import('@/components/dashboard/shops/shops'));
// const Message = dynamic(() => import('@/components/dashboard/shops/message'));
// const StoreNotices = dynamic(
//   () => import('@/components/dashboard/shops/store-notices')
// );
// import { adminOnly, getAuthCredentials, hasAccess, ownerOnly } from '@/utils/auth-utils';
// import { title } from 'process';

// const tabList = [
//   {
//     title: 'common:sidebar-nav-item-shops',
//     children: 'ShopList',
//   },
//   {
//     title: 'common:sidebar-nav-item-message',
//     children: 'Message',
//   },
//   {
//     title: 'common:sidebar-nav-item-store-notice',
//     children: 'StoreNotices',
//   },
//   {
//     title: 'common:sidebar-nav-item-dashboard',
//     children: 'DashboardIcon',
//   },
//   {
//     // href: Routes.permission.list,
//     title: 'sidebar-nav-item-permissions',
//     children: 'CalendarScheduleIcon',
//     permissions: ownerOnly,
//   },
//   {
//     // href: Routes.user.list,
//     title: 'sidebar-nav-item-users',
//     children: 'UsersIcon',
//     permissions: ownerOnly,
//   },
// ];

// const MAP_PAGE_LIST: Record<string, any> = {
//   ShopList: ShopList,
//   Message: Message,
//   StoreNotices: StoreNotices,
// };

// const OwnerShopLayout = () => {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const { query } = router;

//   console.log("pE++++", query)
//   const classNames = {
//     basic:
//       'lg:text-[1.375rem] font-semibold border-b-2 border-solid border-transparent lg:pb-5 pb-3 -mb-0.5',
//     selected: 'text-accent hover:text-accent-hover border-current',
//     normal: 'hover:text-black/80',
//   };

//   return (
//     <>
//       <Tab.Group
//         defaultIndex={
//           !isEmpty(query?.tab) && query?.tab ? Number(query?.tab) : 0
//         }
//         onChange={(index: any) => {
//           router.push({
//             query: { tab: index },
//           });
//         }}
//       >
//         <Tab.List className="flex flex-wrap gap-x-9 border-b-2 border-solid border-b-[#E4E1E7]">
//           {tabList?.map((tab, key) => {
//             let { title } = tab;
//             return (
//               <Tab as={Fragment} key={key}>
//                 {({ selected }) => (
//                   <button
//                     className={cn(
//                       selected ? classNames?.selected : classNames?.normal,
//                       classNames?.basic
//                     )}
//                   >
//                     {t(title)}
//                   </button>
//                 )}
//               </Tab>
//             );
//           })}
//         </Tab.List>
//         <Tab.Panels
//           className="mt-4 lg:mt-8"
//           style={{ height: 'calc(100% - 94px)' }}
//         >
//           {tabList?.map((tab, key) => {
//             let { children } = tab;
//             const Component = MAP_PAGE_LIST[children];
//             return (
//               <Tab.Panel key={key} className="h-full">
//                 <Component />
//               </Tab.Panel>
//             );
//           })}
//         </Tab.Panels>
//       </Tab.Group>
//     </>
//   );
// };

// const OwnerDashboard = () => {
//   const { permissions } = getAuthCredentials();
//   let permission = hasAccess(adminOnly, permissions);
//   return permission ? <ShopList /> : <OwnerShopLayout />;
// };

// export default OwnerDashboard;

import { CartIconBig } from '@/components/icons/cart-icon-bag';
import { CoinIcon } from '@/components/icons/coin-icon';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import ErrorMessage from '@/components/ui/error-message';
import usePrice from '@/utils/use-price';
import Loader from '@/components/ui/loader/loader';
import RecentOrders from '@/components/order/recent-orders';
import PopularProductList from '@/components/product/popular-product-list';
import { useOrdersQuery } from '@/data/order';
import { useTranslation } from 'next-i18next';
// import { useWithdrawsQuery } from '@/data/withdraw';
// import WithdrawTable from '@/components/withdraw/withdraw-table';
import { MyShopIcon, ShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useAnalyticsQuery, usePopularProductsQuery } from '@/data/dashboard';
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { siteSettings } from '@/settings/site.settings';
import { CustomerIcon } from '../icons/sidebar/customer';

export default function OwnerDashboard(user: any) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [getPermission, _] = useAtom(newPermission);
  const { permissions } = getAuthCredentials();
  // const canWrite = siteSettings.sidebarLinks.owner
  // permissions?.includes('owner')
    // ? siteSettings.sidebarLinks.owner
    // : getPermission?.find(
    //     (permission) => permission.type === 'sidebar-nav-item-dealerlist'
    //   )?.write;

  const { data: useMe } = useMeQuery();

  const customerId = useMe?.id ?? '';

  console.log('customerId');

  const query = {
    customerId: parseInt(customerId),
    state: '',
  };

  // const { data, isLoading: loading } = useAnalyticsQuery(query);
  // const { price: total_revenue } = usePrice(
  //   data && {
  //     amount: data?.totalRevenue!,
  //   }
  // );

  // const { price: todays_revenue } = usePrice(
  //   data && {
  //     amount: data?.todaysRevenue!,
  //   }
  // );

  // const {
  //   error: orderError,
  //   orders: orderData,
  //   loading: orderLoading,
  //   paginatorInfo,
  // } = useOrdersQuery({
  //   customer_id: parseInt(customerId),
  //   language: locale,
  //   limit: 10,
  //   page: 1,
  // });

  // const {
  //   data: popularProductData,
  //   isLoading: popularProductLoading,
  //   error: popularProductError,
  // } = usePopularProductsQuery({ limit: 10, language: locale });

  // const { withdraws, loading: withdrawLoading } = useWithdrawsQuery({
  //   limit: 10,
  // });

  // if (loading || orderLoading || popularProductLoading || withdrawLoading) {
  //   if (loading || orderLoading || popularProductLoading) {
  //   return <Loader text={t('common:text-loading')} />;
  // }
  // if (orderError || popularProductError) {
  //   return (
  //     <ErrorMessage
  //       message={orderError?.message || popularProductError?.message}
  //     />
  //   );
  // }
  // let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  // if (!!data?.totalYearSaleByMonth?.length) {
  //   salesByYear = data.totalYearSaleByMonth.map((item: any) =>
  //     item.total.toFixed(2)
  //   );
  // }

  // console.log('data----analytics', data);

  console.log('getPermission', getPermission);

  console.log('permissions', permissions);

  return (
    <>
      <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-rev"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<DollarIcon className="h-7 w-7" color="#047857" />}
            iconBgStyle={{ backgroundColor: '#A7F3D0' }}
            price={total_revenue}
          />
        </div> */}
        {/* <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-order"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<CartIconBig />}
            price={data?.totalOrders}
          />
        </div> */}
        {/* <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-today-rev"
            icon={<CoinIcon />}
            price={todays_revenue}
          />
        </div> */}
        {/* {canWrite ? (
          <div className="w-full ">
            <StickerCard
              titleTransKey="sticker-card-title-total-shops"
              icon={<ShopIcon className="w-6" color="#1D4ED8" />}
              iconBgStyle={{ backgroundColor: '#93C5FD' }}
              // price={data?.totalShops}
            />
          </div>
        ) : ( */}
          <div className="w-full ">
            <StickerCard
              titleTransKey="sticker-card-title-total-company"
              icon={<MyShopIcon className="w-6" color="#1D4ED8" />}
              iconBgStyle={{ backgroundColor: '#93C5FD' }}
              // price={data?.totalShops}
            />
          </div>
          <div className="w-full ">
            <StickerCard
              titleTransKey="sticker-card-title-total-customer"
              icon={<CustomerIcon className="w-6" color="#1D4ED8" />}
              iconBgStyle={{ backgroundColor: '#93C5FD' }}
              // price={data?.totalShops}
            />
          </div>
        {/* )} */}
      </div>

      {/* <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
        <ColumnChart
          widgetTitle={t('common:sale-history')}
          colors={['#03D3B5']}
          // series={salesByYear}
          categories={[
            t('common:january'),
            t('common:february'),
            t('common:march'),
            t('common:april'),
            t('common:may'),
            t('common:june'),
            t('common:july'),
            t('common:august'),
            t('common:september'),
            t('common:october'),
            t('common:november'),
            t('common:december'),
          ]}
        />
      </div> */}

      <div className="mb-6 flex w-full flex-wrap space-y-6 rtl:space-x-reverse xl:flex-nowrap xl:space-y-0 xl:space-x-5">
        {/* <div className="w-full">
          <RecentOrders
            orders={orderData}
            title={t('table:recent-order-table-title')}
          />
        </div> */}

        {/* <div className="w-full xl:w-1/2">
          <WithdrawTable
            withdraws={withdraws}
            title={t('table:withdraw-table-title')}
          />
        </div> */}
      </div>
      {/* <div className="mb-6 w-full xl:mb-0">
        <PopularProductList
          products={popularProductData}
          title={t('table:popular-products-table-title')}
        />
      </div> */}
    </>
  );
}
