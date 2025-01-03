import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import CategoryTypeFilter from '@/components/product/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import ProductCard from '@/components/product/card';
import Cart from '@/components/cart/cart';
import { useUI } from '@/contexts/ui.context';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import CartCounterButton from '@/components/cart/cart-counter-button';
import Pagination from '@/components/ui/pagination';
import { Product, ProductStatus } from '@/types';
import { useProductsQuery } from '@/data/product';
import NotFound from '@/components/ui/not-found';
import { useRouter } from 'next/router';
import { useSettings } from '@/contexts/settings.context';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { siteSettings } from '@/settings/site.settings';
import { toggleAtom } from '@/utils/atoms';
import { useMeQuery } from '@/data/user';
// import { useGetStock } from '@/data/stocks';
import { useGetStock } from '@/data/stock';
import StockCard from '@/components/product/StockCard';
import Card from '@/components/common/card';
import StockCounterButton from '@/components/stock/stock-counter-btn';
import Stock from '@/components/stock/Stock';
import { AllPermission } from '@/utils/AllPermission';

export default function SalesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const { displayCartSidebar, closeCartSidebar } = useUI();
  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const { data: meData } = useMeQuery();
  const [isChecked] = useAtom(toggleAtom);

  const { data: stockData, isLoading, error } = useGetStock(meData?.id);

  console.log("stockData",stockData)
 

  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-create-order');

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }


  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">Create Sales</h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              onCategoryFilter={({ slug }: { slug: string }) => {
                setCategory(slug);
                setPage(1);
              }}
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
                setPage(1);
              }}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {isLoading && <Loader text={t('common:text-loading')} />}

      {!isLoading && (
        <>
          <div className="flex space-x-5">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6">
              {stockData?.map((e: Product) => (
                <StockCard
                  key={e.id}
                  item={e.product}
                  isChecked={isChecked}
                  inStock={e.inStock}
                />
              ))}
            </div>
          </div>
          {!stockData?.length ? (
            <NotFound text="text-not-found" className="mx-auto w-7/12" />
          ) : null}
        </>
      )}

      {canWrite ? <StockCounterButton /> : null}
      <Drawer
        open={displayCartSidebar}
        onClose={closeCartSidebar}
        variant="right"
      >
        <DrawerWrapper hideTopBar={true}>
          <Stock />
        </DrawerWrapper>
      </Drawer>
    </>
  );
}
SalesPage.authenticate = {
  permissions: adminOnly,
};
SalesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
