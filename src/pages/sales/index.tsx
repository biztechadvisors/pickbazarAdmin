import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import { Fragment, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { MoreIcon } from '@/components/icons/more-icon';
import { useExportOrderQuery } from '@/data/export';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import {  useOrdersSalesQuery } from '@/data/stocks';
import StockList from '@/components/stock/StockList';
import { useOrdersQuery } from '@/data/order';
import { useMeQuery } from '@/data/user';
import OrderList from '@/components/order/order-list';
import { Company } from '@/utils/constants';
import { GetStockSeals, useGetStockSeals } from '@/data/stock';


export default function Sales() {
  const router = useRouter();
  const { locale } = useRouter();
  const {
    query: { shop },
  } = router;
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const { data: me } = useMeQuery(); 


  const { orders, loading, paginatorInfo, error } = useOrdersQuery({
    language: locale,
    limit: 20,
    page,
    tracking_number: searchTerm,
    customer_id: me?.id,
    shop_id: me?.managed_shop?.id,
    shop_slug: me?.managed_shop?.slug,
  });

 

  const customer_id = me?.id
  const shop_id =  me?.createdBy?.shop_id
 

  console.log("shop_id",me?.createdBy?.shop_id)

  const { data: response } = useGetStockSeals(customer_id, shop_id);
  // http://localhost:5000/api/stocks/orders?customer_id=3

  const { refetch } = useExportOrderQuery(
    {
      ...(me?.createdBy?.managed_shop?.id && { shop_id: me?.createdBy.managed_shop?.id }),
    },
    { enabled: false }
  );

  if (loading) return <Loader text={t('common:text-loading')} />;

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  

  async function handleExportOrder() {
    try {
      const ordersData = orders.filter(
        (order) => order?.customer_id === order?.dealer?.id
      );
    
      if (!ordersData.length) {
        console.error('No matching orders found for export.');
        return; // Handle no data scenario (e.g., display message to user)
      }

      const formattedData = transformForExcel(ordersData);

      const contentType = 'text/csv;charset=utf-8'; // Consistent with CSV export
      const filename = generateFilename(contentType);

      const blob = new Blob([formattedData], { type: contentType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      setTimeout(() => URL.revokeObjectURL(link.href), 10000); // Revoke after 10 seconds
    } catch (error) {
      console.error('Error fetching or formatting data:', error);
      // Handle error gracefully (e.g., display message to user)
    }
  }

  function transformForExcel(ordersData: any) {
    // Create an array with column headers
    const headerRow = [
      'OrderId',
      'Email',
      'Order Date',
      'Delivery Time',
      'Order Status',
      'Traking Nunmber',
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

    // Create an array of data rows with corresponding values
    const dataRows = ordersData.map((order: any) => {
      const billingAddress = order.billing_address
        ? `${order.billing_address.street_address} ${order.billing_address.country} ${order.billing_address.city} ${order.billing_address.state} ${order.billing_address.zip}`
        : '';
      const shippingAddress = order.shipping_address
        ? `${order.shipping_address.street_address} ${order.shipping_address.country} ${order.shipping_address.city} ${order.shipping_address.state} ${order.shipping_address.zip}`
        : '';

      const escapedBillingAddress = billingAddress.replace(/,/g, '');
      const escapedShippingAddress = shippingAddress.replace(/,/g, '');

      // Extract and format contact number with country code (assuming country code is in a separate field)
      const contactNumber = order.customer_contact
        ? order.customer_contact // Remove non-digits
        : '';

      // Remove non-digits from tracking number
      const trackingNumber = order.tracking_number ? order.tracking_number : '';


  

      return [
        order.payment_intent?.order_id || null, // Handle potential missing values
        order.customer?.email || null,
        order.created_at,
        order.delivery_time,
        order.order_status,
        trackingNumber,
        order.coupon_id,
        order.amount,
        order.discount,
        order.paid_total,
        order.total,
        order.sales_tax,
        order.delivery_fee || 0,
        order.payment_intent?.payment_intent_info.payment_id || null,
        order.payment_gateway,
        contactNumber,
        escapedBillingAddress,
        escapedShippingAddress,
        order.logistics_provider,
      ];
    });

    // Combine header row and data rows into a single string
    const csvContent = [headerRow.join(',')].concat(dataRows.map((row: any) => row.join(','))).join('\n');

    return csvContent;
  }

  function generateFilename(contentType: any) {
    const dateString = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    let extension;
    switch (contentType) {
      case 'text/csv;charset=utf-8':
        extension = '.csv';
        break;
      case 'application/pdf': // Add PDF case if PDF export is implemented
        extension = '.pdf';
        break;
      default:
        extension = '.csv';
    }
    return `export-data-${dateString}${extension}`;
  }


  const DealerSalesList = response?.data

 

  var ordersData = orders.filter(
    (order) => order?.customer_id == order?.dealer?.id
  );

  const ShopShow = me?.permission.type_name === Company;

 


  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">Sales</h1>
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <Search onSearch={handleSearch} />
        </div>

        <Menu
          as="div"
          className="relative inline-block ltr:text-left rtl:text-right"
        >
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
            <Menu.Items
              as="ul"
              className={classNames(
                'shadow-700 absolute z-50 mt-2 w-52 overflow-hidden rounded border border-border-200 bg-light py-2 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left'
              )}
            >
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleExportOrder}
                    className={classNames(
                      'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 hover:text-accent focus:outline-none rtl:space-x-reverse',
                      active ? 'text-accent' : 'text-body'
                    )}
                  >
                    <DownloadIcon className="w-5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {t('common:text-export-orders')}
                    </span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </Card>

      {ShopShow ? (
        <StockList
          orders={ordersData}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      ) : (
        <OrderList
          orders={DealerSalesList}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      )}

   
    </>
  );
}

Sales.authenticate = {
  permissions: adminOnly,
};
Sales.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
