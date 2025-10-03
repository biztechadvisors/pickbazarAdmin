import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import ProductList from '@/components/product/product-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CategoryTypeFilter from '@/components/product/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { adminOnly } from '@/utils/auth-utils';
import StockList from '@/components/stocks/stock-list';
import { useGetStock } from '@/data/stock';
import { useMeQuery } from '@/data/user';
import { useDealerStocks } from '@/data/stocks';

export default function DealerStockList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const router = useRouter();

  const { data: meData } = useMeQuery();
  const { id } = meData || {};

  const { data, isLoading, isError } = useDealerStocks(id);

  console.log("DealerStockList", DealerStockList)
  console.log("DealerStock -id", id)

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handleView(item) {
    router.push({
      pathname: '/stocks/data',
      query: { id: item?.user?.id },
    });
  }

  if(isLoading) return <Loader/>
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('table:table-item-stock')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>
        </div>
      </Card>

      <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">SL.No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.user.name}</td>
                <td className="border px-4 py-2">{item.user.email}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleView(item)}
                  >
                    view
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
DealerStockList.authenticate = {
  permissions: adminOnly,
};
DealerStockList.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
