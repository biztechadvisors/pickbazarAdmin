// import { CartIconBig } from '@/components/icons/cart-icon-bag';
// import StickerCard from '@/components/widgets/sticker-card';
// import { useTranslation } from 'next-i18next';
// import { DollarIcon } from '@/components/icons/shops/dollar';
// import { useRouter } from 'next/router';
// import { useMeQuery, useUsersQuery } from '@/data/user';
// import { useShopsQuery } from '@/data/shop';
// import { useState } from 'react';
// import { SortOrder } from '@/types';
// import { CustomerIcon } from '../icons/sidebar/customer';
// import { MyShopIcon } from '../icons/sidebar';

// export default function OwnerDashboard(user: any) {
//   const { t } = useTranslation();
//   const { locale } = useRouter();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(1);
//   const [orderBy, setOrder] = useState('created_at');
//   const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

//   const { data: useMe } = useMeQuery();

//   const { shops } = useShopsQuery({
//     name: searchTerm,
//     limit: 10,
//     page,
//     orderBy,
//     sortedBy,
//   });

//   const { users } = useUsersQuery({
//     limit: 20,
//     usrById: useMe?.id,
//     email: searchTerm,
//     page,
//     name: searchTerm,
//     orderBy,
//     sortedBy,
//   });

//   const total_shops = shops?.length;
//   const total_users = users?.length;

//   return (
//     <>
//       <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <div className="w-full ">
//           <StickerCard
//             titleTransKey="sticker-card-title-company"
//             // subtitleTransKey="sticker-card-subtitle-company"
//             icon={<MyShopIcon className="h-7 w-7" color="#1D4ED8" />}
//             iconBgStyle={{ backgroundColor: '#93C5FD' }}
//             price={total_shops}
//           />
//         </div>
//         <div className="w-full ">
//           <StickerCard
//             titleTransKey="sticker-card-title-users"
//             icon={ <CustomerIcon className="w-8 h-8" color="#1D4ED8" />}
//             iconBgStyle={{ backgroundColor: '#93C5FD' }}
//             price={total_users}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

import { CartIconBig } from '@/components/icons/cart-icon-bag';
import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { useShopsQuery } from '@/data/shop';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { CustomerIcon } from '../icons/sidebar/customer';
import { MyShopIcon } from '../icons/sidebar';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import ShopList from '@/components/shop/shop-list';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import { OWNER } from '@/utils/constants';
import { getAuthCredentials } from '@/utils/auth-utils';

export default function OwnerDashboard(user: any) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { data: useMe } = useMeQuery();
  const { permissions } = getAuthCredentials();

  const { shops, paginatorInfo } = useShopsQuery({
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
  const canWrite = permissions?.includes(OWNER);

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
    {canWrite && (//show only if user is owner 
      <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="w-full">
          <StickerCard
            titleTransKey="sticker-card-title-company"
            icon={<MyShopIcon className="h-7 w-7" color="#1D4ED8" />}
            iconBgStyle={{ backgroundColor: '#93C5FD' }}
            price={total_shops}
          />
        </div>
        <div className="w-full">
          <StickerCard
            titleTransKey="sticker-card-title-users"
            icon={<CustomerIcon className="w-8 h-8" color="#1D4ED8" />}
            iconBgStyle={{ backgroundColor: '#93C5FD' }}
            price={total_users}
          />
        </div>
      </div>
    )}
      {/* Shop List Section */}
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-shops')}
          </h1>
        </div>
        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <div className="flex w-full items-center">
            <Search onSearch={handleSearch} /> 
          </div>
        </div>
      </Card>
      <ShopList
        shops={shops}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
