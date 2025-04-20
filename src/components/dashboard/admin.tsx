import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { useOrdersQuery } from '@/data/order';
import { useAnalyticsQuery, usePopularProductsQuery } from '@/data/dashboard';
import { useGetStockSales } from '@/data/stock';

import { AllPermission } from '@/utils/AllPermission';
import { Company, DEALER } from '@/utils/constants';

import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import Footer from '@/components/dashboard/Footer';

import StickerCard from '@/components/widgets/sticker-card';
import ColumnChart from '@/components/widgets/column-chart';
import RecentOrders from '@/components/order/recent-orders';
import PopularProductList from '@/components/product/popular-product-list';

import { DollarIcon } from '@/components/icons/shops/dollar';
import { CartIconBig } from '@/components/icons/cart-icon-bag';
import { CoinIcon } from '@/components/icons/coin-icon';
import { ShopIcon } from '@/components/icons/sidebar';
import { CustomerIcon } from '@/components/icons/sidebar/customer';

export default function Dashboard() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-dealerlist');

  const { data: meData } = useMeQuery();
  const [shopSlug, setShopSlug] = useState<string | null>(null);

  const page = 1;
  const DealerShow = meData?.permission.type_name === DEALER;
  const ShopShow = meData?.permission.type_name === Company;
  const customerId = meData?.id ? Number(meData.id) : undefined;
  const shopId = meData?.managed_shop?.id;

  // Load stored shopSlug from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSlug = localStorage.getItem('shopSlug');
      if (storedSlug) setShopSlug(storedSlug);
    }
  }, []);

  // Shop Info
  const { data: shopData, isLoading: shopLoading, error: shopError } = useShopQuery({ slug: shopSlug || '' });

  // Analytics Data
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsQuery({
    customerId,
    shop_id: shopId,
    state: '',
  });

  // Orders Data
  const queryConfig = {
    language: locale,
    limit: 20,
    page,
    type: 'Customer',
    ...(shopData?.slug && {
      shopSlug: shopData.slug,
      shop_id: shopData.id,
    }),
    ...(DealerShow && {
      customer_id: customerId,
    }),
  };

  const {
    orders: orderData,
    paginatorInfo,
    error: orderError,
    loading: orderLoading,
  } = useOrdersQuery(queryConfig);

  // Dealer Sales (if Dealer)
  const { data: stockSalesData } = useGetStockSales(customerId, shopId);
  const DealerSalesList = stockSalesData?.data;

  // Popular Products
  const {
    data: popularProductData,
    isLoading: popularProductLoading,
    error: popularProductError,
  } = usePopularProductsQuery({
    limit: 10,
    language: locale,
    shop_id: shopId,
  });

  // Handle Loading
  if (analyticsLoading || orderLoading || popularProductLoading || shopLoading) {
    return <Loader text={t('common:text-loading')} />;
  }

  // Handle Errors
  const errorMessage =
    analyticsError?.message || orderError?.message || popularProductError?.message || shopError?.message;

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  // Sales Chart Data
  const salesByYear = analyticsData?.totalYearSaleByMonth?.map(item => Number(item?.total?.toFixed(2))) ?? Array(12).fill(0);

  return (
    <>
      {/* Shop Branding */}
      {shopData?.logo?.original && (
        <img
          src={shopData.logo.original}
          alt="Logo"
          className="w-14 h-14 object-cover rounded-full"
        />
      )}
      {shopData?.name && (
        <span className="mt-2 text-sm font-semibold text-gray-700">
          {shopData.name}
        </span>
      )}

      {/* Cover Image */}
      {shopData?.cover_image?.[0]?.original && (
        <div className="relative mb-6 w-full rounded-lg overflow-hidden shadow-lg">
          <img
            src={shopData.cover_image[0].original}
            alt="Cover"
            className="w-full h-52 object-cover"
          />
        </div>
      )}

      {/* Analytics Cards */}
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
          titleTransKey={
            canWrite
              ? 'sticker-card-title-total-shops'
              : 'sticker-card-title-total-cutomer'
          }
          icon={
            canWrite
              ? <ShopIcon className="w-6" color="#1D4ED8" />
              : <CustomerIcon className="w-6" color="#1D4ED8" />
          }
          iconBgStyle={{ backgroundColor: '#93C5FD' }}
          price={
            canWrite
              ? analyticsData?.totalDealers ?? 0
              : analyticsData?.totalCustomers ?? 0
          }
        />
      </div>

      {/* Sales Chart */}
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

      {/* Orders */}
      <div className="mb-6 w-full flex-wrap space-y-6 xl:flex-nowrap xl:space-y-0 xl:space-x-5">
        <RecentOrders orders={orderData} title={t('table:recent-order-table-title')} />
      </div>

      {/* Dealer Sales */}
      {DealerShow && DealerSalesList?.length > 0 && (
        <div className="mb-6 w-full flex-wrap space-y-6 xl:flex-nowrap xl:space-y-0 xl:space-x-5">
          <RecentOrders orders={DealerSalesList} title={t('Recent Sales')} />
        </div>
      )}

      {/* Footer */}
      <Footer canWrite={canWrite} shopName={shopData?.name} />
    </>
  );
}
