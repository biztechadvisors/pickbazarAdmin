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
import { ShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useAnalyticsQuery, usePopularProductsQuery } from '@/data/dashboard';
import { useRouter } from 'next/router';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { siteSettings } from '@/settings/site.settings';
import { CustomerIcon } from '../icons/sidebar/customer';
import { useShopQuery, useShopsQuery } from '@/data/shop';
import { useState } from 'react';
import { SortOrder } from '@/types';

export default function OwnerDashboard(user: any) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [getPermission, _] = useAtom(newPermission);
  const { permissions } = getAuthCredentials();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { data: useMe } = useMeQuery();

  const customerId = useMe?.id ?? '';

  const query = {
    customerId: parseInt(customerId),
    state: '',
  };

  const { shops } = useShopsQuery({
    name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
  });

  const { users } = useUsersQuery({
    limit: 20,
    usrById: useMe?.id,
    email: searchTerm,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
  });

  const total_shops = shops?.length;
  const total_users = users?.length;

  return (
    <>
      <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="w-full ">
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
        </div>
        
      </div>

      

      <div className="mb-6 flex w-full flex-wrap space-y-6 rtl:space-x-reverse xl:flex-nowrap xl:space-y-0 xl:space-x-5">
        
      </div>
     
    </>
  );
}
