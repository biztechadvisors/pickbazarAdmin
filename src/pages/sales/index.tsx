import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import { Fragment, useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { MoreIcon } from '@/components/icons/more-icon';
import { useExportOrderQuery } from '@/data/export';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useOrdersSalesQuery } from '@/data/stocks';
import StockList from '@/components/stock/StockList';
import { useOrdersQuery } from '@/data/order';
import { useMeQuery } from '@/data/user';
import OrderList from '@/components/order/order-list';
import { Company, DEALER } from '@/utils/constants';
import { useGetStockSales } from '@/data/stock';

export default function Sales() {
  const { locale, query } = useRouter();
  const { shop } = query;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [shopSlug, setShopSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShopSlug(localStorage.getItem('shopSlug'));
    }
  }, []);

  const handleSearch = ({ searchText }: { searchText: string }) => {
    setSearchTerm(searchText);
    setPage(1);
  };

  const handlePagination = (current: number) => {
    setPage(current);
  };

  const { data: me } = useMeQuery();
  const userType = me?.permission?.type_name;
  const isDealer = userType === DEALER;
  const isCompany = userType === Company;

  const queryConfig: any = {
    language: locale,
    limit: 20,
    page,
    ...(isDealer && { customer_id: me?.id }),
    ...(isCompany && { shopSlug: me?.managed_shop?.slug, type: 'Dealer' }),
  };

  const { orders, loading: ordersLoading, paginatorInfo, error: ordersError } =
    isCompany ? useOrdersQuery(queryConfig) : useGetStockSales(me?.id, me?.createdBy?.shop_id);

  const { refetch } = useExportOrderQuery(
    { shop_id: me?.createdBy?.managed_shop?.id },
    { enabled: false }
  );

  if (ordersLoading) return <Loader text={t('common:text-loading')} />;
  if (ordersError) return <ErrorMessage message={ordersError?.message || 'An error occurred'} />;

  const handleExportOrder = async () => {
    try {
      const ordersData = orders?.filter((order) => order?.customer_id === order?.dealer?.id);

      if (!ordersData?.length) {
        console.error('No matching orders found for export.');
        return;
      }

      const formattedData = transformForExcel(ordersData);
      downloadFile(formattedData, 'text/csv;charset=utf-8', 'export-orders.csv');
    } catch (error) {
      console.error('Error fetching or formatting data:', error);
    }
  };

  const transformForExcel = (ordersData: any[]) => {
    const headers = [
      'OrderId',
      'Email',
      'Order Date',
      'Delivery Time',
      'Order Status',
      'Tracking Number',
      'CouponId',
      'Amount',
      'Discount',
      'Paid',
      'Total',
      'Sale Tax',
      'Delivery Fee',
      'PaymentId',
      'Payment Gateway',
      'Customer Contact',
      'Billing Address',
      'Shipping Address',
      'Logistic Provider',
    ];

    const rows = ordersData.map((order) => [
      order.payment_intent?.order_id || '',
      order.customer?.email || '',
      order.created_at || '',
      order.delivery_time || '',
      order.order_status || '',
      order.tracking_number || '',
      order.coupon_id || '',
      order.amount || '',
      order.discount || '',
      order.paid_total || '',
      order.total || '',
      order.sales_tax || '',
      order.delivery_fee || 0,
      order.payment_intent?.payment_intent_info?.payment_id || '',
      order.payment_gateway || '',
      order.customer_contact || '',
      formatAddress(order.billing_address),
      formatAddress(order.shipping_address),
      order.logistics_provider || '',
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  };

  const formatAddress = (address: any) =>
    address
      ? `${address.street_address}, ${address.city}, ${address.state}, ${address.zip}, ${address.country}`
      : '';

  const downloadFile = (data: string, contentType: string, filename: string) => {
    const blob = new Blob([data], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">Sales</h1>
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <Search onSearch={handleSearch} />
        </div>

        <Menu as="div" className="relative inline-block">
          <Menu.Button className="group p-2">
            <MoreIcon className="w-3.5 text-body" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-50 mt-2 w-52 rounded border bg-light py-2 shadow-lg">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleExportOrder}
                    className={classNames(
                      'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none',
                      active ? 'text-accent' : 'text-body'
                    )}
                  >
                    <DownloadIcon className="w-5 shrink-0" />
                    <span>{t('common:text-export-orders')}</span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </Card>

      {isCompany ? (
        <StockList
          orders={orders}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      ) : (
        <OrderList
          orders={orders}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
          Shop={false}
        />
      )}
    </>
  );
}

Sales.authenticate = { permissions: adminOnly };
Sales.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: { ...(await serverSideTranslations(locale, ['table', 'common', 'form'])) },
});
