import { CartIconBig } from '@/components/icons/cart-icon-bag';
import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'next-i18next';
import { ShopIcon, MyShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useRouter } from 'next/router';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useShopsQuery } from '@/data/shop';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { CustomerIcon } from '../icons/sidebar/customer';


export default function OwnerDashboard(users: any) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { data: useMe } = useMeQuery();

  const { shops } = useShopsQuery({
    name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
  });

  console.log('customerId');

  const total_shops = shops?.length;
  const total_users = users?.length;

  return (
    <>
      <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-shops"
            subtitleTransKey="sticker-card-subtitle-shops"
            icon={<DollarIcon className="h-7 w-7" color="#047857" />}
            iconBgStyle={{ backgroundColor: '#A7F3D0' }}
            price={total_shops}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-users"
            icon={<CartIconBig />}
            price={total_users}
          />
        </div>  */}
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

      {/* <div className="mb-6 flex w-full flex-wrap space-y-6 rtl:space-x-reverse xl:flex-nowrap xl:space-y-0 xl:space-x-5"> */}
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
      {/* </div> */}
      {/* <div className="mb-6 w-full xl:mb-0">
        <PopularProductList
          products={popularProductData}
          title={t('table:popular-products-table-title')}
        />
      </div> */}
    </>
  );
}