import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useDealerByIdStocks, useUpdateStockData } from '@/data/stocks';

export default function DealerStockData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const [updatedStocks, setUpdatedStocks] = useState([]);

  const [quant, setQuant] = useState('');
  const [disQuant, setDisQuant] = useState('');
  const [pend, setPend] = useState('');

  const router = useRouter();
  const { id } = router.query;

  const { data } = useDealerByIdStocks(id);
  const { mutate: updateStockData } = useUpdateStockData(id);

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  const handleUpdateStock = (index, field, value) => {
    const updatedStock = [...updatedStocks];
    if (updatedStock[index]) {
      updatedStock[index][field] = value;
      setUpdatedStocks(updatedStock);
    } else {
      const newStock = { ...data[index] };
      newStock[field] = value;
      updatedStock[index] = newStock;
      setUpdatedStocks(updatedStock);
    }
  };

  const handleSaveChanges = async (index) => {
    const stocksData = updatedStocks[index];

    const {
      quantity: quantityStr,
      ordPendQuant: ordPendQuantStr,
      dispatchedQuantity: dispatchedQuantityStr,
      inStock,
      status,
      product,
    } = stocksData;

    const quantity = parseInt(quantityStr, 10);
    const ordPendQuant = parseInt(ordPendQuantStr, 10);
    const dispatchedQuantity = parseInt(dispatchedQuantityStr, 10);

    const productId = product ? product.id : undefined;

    updateStockData({
      quantity,
      ordPendQuant,
      dispatchedQuantity,
      inStock,
      status,
      product: productId,
    });
  };

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

      {/* <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200"> */}
      <div className="overflow-x-auto">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">SL.No</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Dispatch</th>
                    <th className="px-4 py-2">Pending</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {item?.product?.name}
                      </td>
                      <td className="border px-4 py-2">
                        {item?.status ? 'In Stock' : 'Out of Stock'}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={
                            updatedStocks[index]?.quantity || item.quantity
                          }
                          onChange={(e) =>
                            handleUpdateStock(index, 'quantity', e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={
                            updatedStocks[index]?.dispatchedQuantity ||
                            item.dispatchedQuantity
                          }
                          onChange={(e) =>
                            handleUpdateStock(
                              index,
                              'dispatchedQuantity',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={
                            updatedStocks[index]?.ordPendQuant ||
                            item.ordPendQuant
                          }
                          onChange={(e) =>
                            handleUpdateStock(
                              index,
                              'ordPendQuant',
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border px-4 py-2">
                        <button
                          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-blue-600"
                          onClick={() => handleSaveChanges(index)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DealerStockData.authenticate = {
  permissions: adminOnly,
};
DealerStockData.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
