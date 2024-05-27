import { CartIconBig } from '@/components/icons/cart-icon-bag';
import { CoinIcon } from '@/components/icons/coin-icon';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import RecentOrders from '@/components/order/recent-orders';
import PopularProductList from '@/components/product/popular-product-list';
import { useOrdersQuery } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { ShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useAnalyticsQuery, usePopularProductsQuery } from '@/data/dashboard';
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';
import { CustomerIcon } from '../icons/sidebar/customer';
import { AllPermission } from '@/utils/AllPermission';

export default function Dashboard() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-dealerlist');
  const { data: meData } = useMeQuery();
  const customerId = meData?.id;

  const analyticsQuery = {
    customerId: parseInt(customerId),
    state: '',
  };

  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsQuery(analyticsQuery);

  const { data: orderData, error: orderError, isLoading: orderLoading } = useOrdersQuery({
    customer_id: customerId,
    language: locale,
    limit: 10,
    page: 1,
  });

  const { data: popularProductData, isLoading: popularProductLoading, error: popularProductError } = usePopularProductsQuery({
    limit: 10,
    language: locale,
    shop_id: meData?.shop_id ? meData.shops : meData?.managed_shop.id
  });

  if (analyticsLoading || orderLoading || popularProductLoading) {
    return <Loader text={t('common:text-loading')} />;
  }

  const salesByYear = analyticsData?.totalYearSaleByMonth?.map((item) => item.total.toFixed(2)) || Array(12).fill(0);

  const errorMessage = analyticsError?.message || orderError?.message || popularProductError?.message;

  return (
    <>
      {errorMessage && <ErrorMessage message={errorMessage} />}

      <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StickerCard
          titleTransKey="sticker-card-title-rev"
          subtitleTransKey="sticker-card-subtitle-rev"
          icon={<DollarIcon className="h-7 w-7" color="#047857" />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={analyticsData?.totalRevenue ?? 0}
        />
        <StickerCard
          titleTransKey="sticker-card-title-order"
          subtitleTransKey="sticker-card-subtitle-order"
          icon={<CartIconBig />}
          price={analyticsData?.totalOrders ?? 0}
        />
        <StickerCard
          titleTransKey="sticker-card-title-today-rev"
          icon={<CoinIcon />}
          price={analyticsData?.todaysRevenue ?? 0}
        />
        <StickerCard
          titleTransKey={canWrite ? "sticker-card-title-total-shops" : "sticker-card-title-total-customer"}
          icon={canWrite ? <ShopIcon className="w-6" color="#1D4ED8" /> : <CustomerIcon className="w-6" color="#1D4ED8" />}
          iconBgStyle={{ backgroundColor: '#93C5FD' }}
          price={canWrite ? analyticsData?.totalShops ?? 0 : analyticsData?.totalCustomers ?? 0}
        />
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

      <div className="mb-6 flex w-full flex-wrap space-y-6 xl:flex-nowrap xl:space-y-0 xl:space-x-5">
        <RecentOrders
          orders={orderData}
          title={t('table:recent-order-table-title')}
        />
        <PopularProductList
          products={popularProductData}
          title={t('table:popular-products-table-title')}
        />
      </div>
    </>
  );
}
