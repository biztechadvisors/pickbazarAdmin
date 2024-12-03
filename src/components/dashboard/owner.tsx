import { CartIconBig } from '@/components/icons/cart-icon-bag';
import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'next-i18next';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useRouter } from 'next/router';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useShopsQuery } from '@/data/shop';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { CustomerIcon } from '../icons/sidebar/customer';
import { MyShopIcon } from '../icons/sidebar';

export default function OwnerDashboard(user: any) {
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
            titleTransKey="sticker-card-title-company"
            // subtitleTransKey="sticker-card-subtitle-company"
            icon={<MyShopIcon className="h-7 w-7" color="#1D4ED8" />}
            iconBgStyle={{ backgroundColor: '#93C5FD' }}
            price={total_shops}
          />
        </div>
        <div className="w-full ">
          <StickerCard
            titleTransKey="sticker-card-title-users"
            icon={ <CustomerIcon className="w-8 h-8" color="#1D4ED8" />}
            iconBgStyle={{ backgroundColor: '#93C5FD' }}
            price={total_users}
          />
        </div>
      </div>
    </>
  );
}