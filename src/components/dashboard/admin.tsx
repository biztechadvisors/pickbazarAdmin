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
import { AllPermission } from '@/utils/AllPermission';

export default function Dashboard(user: any) {
  const { t } = useTranslation();
  const { locale } = useRouter();

  // const [getPermission, _] = useAtom(newPermission);
  // const { permissions } = getAuthCredentials();
  // const canWrite = permissions?.includes('super_admin')
  //   ? siteSettings.sidebarLinks
  //   : getPermission?.find(
  //       (permission) => permission.type === 'sidebar-nav-item-dealerlist'
  //     )?.write;

  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-dealerlist');

      console.log("permission", canWrite)
  const { data: useMe } = useMeQuery();

  const customerId = useMe?.id ?? '';

  console.log('customerId', customerId);

  const query = {
    customerId: parseInt(customerId),
    state: '',
  };

  const { data, isLoading: loading } = useAnalyticsQuery(query);
  const { price: total_revenue } = usePrice(
    data && {
      amount: data?.totalRevenue!,
    }
  );

  const { price: todays_revenue } = usePrice(
    data && {
      amount: data?.todaysRevenue!,
    }
  );

  const {
    error: orderError,
    orders: orderData,
    loading: orderLoading,
    paginatorInfo,
  } = useOrdersQuery({
    customer_id: parseInt(customerId),
    language: locale,
    limit: 10,
    page: 1,
  });

  const {
    data: popularProductData,
    isLoading: popularProductLoading,
    error: popularProductError,
  } = usePopularProductsQuery({ limit: 10, language: locale });

  // const { withdraws, loading: withdrawLoading } = useWithdrawsQuery({
  //   limit: 10,
  // });

  // if (loading || orderLoading || popularProductLoading || withdrawLoading) {
    if (loading || orderLoading || popularProductLoading) {
    return <Loader text={t('common:text-loading')} />;
  }
  if (orderError || popularProductError) {
    return (
      <ErrorMessage
        message={orderError?.message || popularProductError?.message}
      />
    );
  }
  let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  if (!!data?.totalYearSaleByMonth?.length) {
    salesByYear = data.totalYearSaleByMonth.map((item: any) =>
      item.total.toFixed(2)
    );
  }

  console.log('data----analytics', data);

  return (
    <>
      <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-rev"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<DollarIcon className="h-7 w-7" color="#047857" />}
            iconBgStyle={{ backgroundColor: '#A7F3D0' }}
            price={total_revenue}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-order"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<CartIconBig />}
            price={data?.totalOrders}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-today-rev"
            icon={<CoinIcon />}
            price={todays_revenue}
          />
        </div>
        {canWrite ? (
          <div className="w-full ">
            <StickerCard
              titleTransKey="sticker-card-title-total-shops"
              icon={<ShopIcon className="w-6" color="#1D4ED8" />}
              iconBgStyle={{ backgroundColor: '#93C5FD' }}
              price={data?.totalShops}
            />
          </div>
        ) : (
          canWrite === 'owner' ? (
            <div className="w-full ">
            <StickerCard
              titleTransKey="sticker-card-title-total-cutomer"
              icon={<MyShopIcon className="w-6" color="#1D4ED8" />}
              iconBgStyle={{ backgroundColor: '#93C5FD' }}
              price={data?.totalShops}
            />
          </div>
          ) :(
            <div className="w-full ">
            <StickerCard
              titleTransKey="sticker-card-title-total-cutomer"
              icon={<CustomerIcon className="w-6" color="#1D4ED8" />}
              iconBgStyle={{ backgroundColor: '#93C5FD' }}
              price={data?.totalShops}
            />
          </div>
          )
        )}
      </div>

      <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
        <ColumnChart
          widgetTitle={t('common:sale-history')}
          colors={['#03D3B5']}
          series={salesByYear}
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
      </div>

      <div className="mb-6 flex w-full flex-wrap space-y-6 rtl:space-x-reverse xl:flex-nowrap xl:space-y-0 xl:space-x-5">
        <div className="w-full">
          <RecentOrders
            orders={orderData}
            title={t('table:recent-order-table-title')}
          />
        </div>

        {/* <div className="w-full xl:w-1/2">
          <WithdrawTable
            withdraws={withdraws}
            title={t('table:withdraw-table-title')}
          />
        </div> */}
      </div>
      <div className="mb-6 w-full xl:mb-0">
        <PopularProductList
          products={popularProductData}
          title={t('table:popular-products-table-title')}
        />
      </div>
    </>
  );
}
