import { CartIconBig } from '@/components/icons/cart-icon-bag';
import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'next-i18next';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useRouter } from 'next/router';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useShopsQuery } from '@/data/shop';
import { useState } from 'react';
import { SortOrder } from '@/types';

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
    </>
  );
}