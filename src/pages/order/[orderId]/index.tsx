import Card from '@/components/common/card';
import { DownloadIcon } from '@/components/icons/download-icon';
import Layout from '@/components/layouts/admin';
import OrderStatusProgressBox from '@/components/order/order-status-progress-box';
import OrderViewHeader from '@/components/order/order-view-header';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import ValidationError from '@/components/ui/form-validation-error';
import Loader from '@/components/ui/loader/loader';
import SelectInput from '@/components/ui/select-input';
import { Table } from '@/components/ui/table';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useDealerStatusChange, useDownloadInvoiceMutation, useOrderQuery, useOrderStocksQuery, useUpdateOrderMutation } from '@/data/order';
import { siteSettings } from '@/settings/site.settings';
import { Attachment, OrderStatus, PaymentStatus } from '@/types';
import { formatAddress } from '@/utils/format-address';
import { formatString } from '@/utils/format-string';
import { useIsRTL } from '@/utils/locals';
import { ORDER_STATUS } from '@/utils/order-status';
import usePrice from '@/utils/use-price';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMeQuery } from '@/data/user';
import { Company, DEALER } from '@/utils/constants';
import DispatchModal from '@/components/ui/modal-component/dispatch-modal';
import { useFetchStockOrderData } from '@/data/stocks';

type FormValues = {
  order_status: any;
};

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [isDispatchModalOpen, setDispatchModalOpen] = useState(false);
  const { data: me } = useMeQuery();
  const DealerShow = me?.permission.type_name === DEALER;

  useEffect(() => {
    resetCart();
    resetCheckout();
  }, [resetCart, resetCheckout]);
  // Error


  const updateOrderMutation = useUpdateOrderMutation();
  const dealerStatusChangeMutation = useDealerStatusChange();
  const mutationHooks = DealerShow ? dealerStatusChangeMutation : updateOrderMutation;
  const { mutate: updateOrder, isLoading: updating, isError, isSuccess } = mutationHooks;

  const orderQuery = useOrderQuery({ id: query.orderId as string, language: locale! });

  const { order: fetchedOrder, isLoading: loading, error } = orderQuery; //DealerShow ? orderStocksQuery :

  const [order, setOrder] = useState(fetchedOrder ?? null);

  useEffect(() => {
    if (fetchedOrder && !order) {
      setOrder(fetchedOrder);
    }
  }, [fetchedOrder, order]);

  const dealerId = order?.customer?.permission?.type_name === DEALER ? order?.customer_id ?? null : null;

  const { data: stockOrderData } = useFetchStockOrderData(
    {
      dealerId: dealerId,
      orderId: query.orderId as string,
    }
  );

  const DispatchButton = me?.permission.type_name === Company;

  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: query.orderId as string,
      isRTL,
      language: locale!,
    },
    { enabled: false }
  );

  const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: { order_status: order?.order_status ?? '' },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      id: order?.id as string,
      name: order_status?.status as string,
      color: order_status?.color as string,
      serial: order_status?.serial as number,
      language: order_status?.language as string,
    });
  };

  const { price: subtotal } = usePrice(order && { amount: order?.amount! });
  const { price: total } = usePrice(order && { amount: order?.paid_total! });
  const { price: discount } = usePrice(order && { amount: order?.discount! ?? 0 });
  const { price: delivery_fee } = usePrice(order && { amount: order?.delivery_fee! });
  const { price: sales_tax } = usePrice(order && { amount: order?.sales_tax! });
  const { price: sub_total } = usePrice({ amount: order?.amount! });
  const { price: shipping_charge } = usePrice({ amount: order?.delivery_fee ?? 0 });
  const { price: wallet_total } = usePrice({ amount: order?.wallet_point?.amount! });
  const totalItem = order?.products?.reduce((initial = 0, p) => initial + parseInt(p?.order_quantity!), 0);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleDownloadInvoice() {
    try {
      const response = await refetch();
      console.log("response ", response)
      if (!response || !response.data) {
        throw new Error('Invalid response received from backend');
      }

      const pdfContent = response.data;
      if (!pdfContent || pdfContent.length === 0) {
        throw new Error('Invalid PDF content received from backend');
      }

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'invoice.pdf';

      document.body.appendChild(link);
      link.click();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }

  const columns = [
    {
      dataIndex: 'image',
      key: 'image',
      width: 70,
      render: (image: Attachment) => (
        <div className="relative h-[50px] w-[50px]">
          <Image src={image?.thumbnail ?? siteSettings.product.placeholder} alt="alt text" fill sizes="(max-width: 768px) 100vw" className="object-fill" />
        </div>
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: string, item: any) => (
        <div>
          <span>{name}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">{item.order_quantity}</span>
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      render: function Render(_: any, item: any) {
        const { price } = usePrice({ amount: parseFloat(item.subtotal) });
        return <span>{price}</span>;
      },
    },
  ];

  function handleDispatchUpdate(data: any): void {
    throw new Error('Function not implemented.');
  }


  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Invoice Header - Made responsive */}
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <OrderViewHeader order={order} wrapperClassName="px-4 py-4 sm:px-8" />
        </div>

        {/* Download Invoice Button - Adjusted for mobile */}
        <div className="flex w-full justify-center sm:justify-start">
          <Button
            onClick={handleDownloadInvoice}
            className="mb-5 bg-blue-500 sm:ml-auto"
            size="small"
          >
            <DownloadIcon className="h-4 w-4 me-2 sm:me-3" />
            <span className="text-xs sm:text-sm">
              {t('common:text-download')} {t('common:text-invoice')}
            </span>
          </Button>
        </div>

        {/* Order ID and Status - Made responsive */}
        <div className="flex flex-col items-center lg:flex-row">
          <h3 className="mb-4 w-full whitespace-nowrap text-center text-xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start sm:text-2xl">
            {t('form:input-label-order-id')} - {order?.tracking_number}
          </h3>

          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-end lg:w-2/3">
            {order?.order_status !== OrderStatus.FAILED &&
              order?.order_status !== OrderStatus.CANCELLED && (
                <form
                  onSubmit={handleSubmit(ChangeStatus)}
                  className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:items-start"
                >
                  <div className="z-20 w-full sm:me-5 sm:w-48 md:w-56">
                    <SelectInput
                      name="order_status"
                      control={control}
                      getOptionLabel={(option: any) => t(option.name)}
                      getOptionValue={(option: any) => option.status}
                      options={ORDER_STATUS.slice(0, 6)}
                      placeholder={t('form:input-placeholder-order-status')}
                    />
                    <ValidationError message={t(errors?.order_status?.message)} />
                  </div>
                  <Button loading={updating} className="w-full sm:w-auto">
                    <span className="text-xs sm:text-sm">
                      {t('form:button-label-change-status')}
                    </span>
                  </Button>
                </form>
              )}

            {order?.customer?.permission?.type_name === DEALER && (
              <Button
                onClick={() => setDispatchModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <span className="text-xs sm:text-sm">
                  {DispatchButton
                    ? t('form:button-label-change-dispatch')
                    : t('Received')}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Body - Made responsive */}
        <div className="mt-6 flex flex-col lg:flex-row lg:gap-8">
          {/* Product List - Adjusted for mobile */}
          <div className="w-full shrink-0 lg:w-2/3 lg:pe-5 xl:w-3/4">
            <div className="overflow-x-auto">
              <Table
                //@ts-ignore
                columns={columns}
                emptyText={t('table:empty-table-data')}
                data={order?.products}
                rowKey="id"
                scroll={{ x: 300 }}
                className="min-w-[600px] sm:min-w-0"
              />
            </div>
            <div className="my-5 flex w-full flex-col items-center">
              <OrderStatusProgressBox status={order?.status?.serial} />
            </div>
          </div>

          {/* Totals and Order Summary - Adjusted for mobile */}
          <div className="mt-6 w-full shrink-0 lg:mt-0 lg:w-1/3 xl:w-1/4">
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 text-lg font-semibold">{t('Order Summary')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-body">
                  <span>{t('common:subtotal')}</span>
                  <span>{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-body">
                  <span>{t('common:text-discount')}</span>
                  <span>{discount}</span>
                </div>
                <div className="flex justify-between text-sm text-body">
                  <span>{t('common:text-delivery-fee')}</span>
                  <span>{delivery_fee}</span>
                </div>
                <div className="flex justify-between text-sm text-body">
                  <span>{t('common:text-tax')}</span>
                  <span>{sales_tax}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-heading">
                    <span>{t('common:text-total')}</span>
                    <span>{total}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 p-4">
              <div className="flex w-full justify-center">
                <span className="text-sm">
                  {formatString(t('Order Date :'), order?.created_at)}
                </span>
              </div>
              {order?.shipping_address && (
                <div className="mt-3">
                  <h4 className="mb-2 text-sm font-medium">{t('Shipping Address')}</h4>
                  <address className="text-xs not-italic text-body sm:text-sm">
                    {formatAddress(order?.shipping_address)}
                  </address>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Details Card - Made responsive */}
      <Card className="mt-6">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-heading mb-3 sm:text-xl sm:mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <div className="flex flex-col">
              <span className="text-xs text-body sm:text-sm">Name:</span>
              <span className="text-sm font-medium text-heading sm:text-base">{order?.customer?.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-body sm:text-sm">Email:</span>
              <span className="text-sm font-medium text-heading sm:text-base">{order?.customer?.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-body sm:text-sm">Contact:</span>
              <span className="text-sm font-medium text-heading sm:text-base">{order?.customer?.contact}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-body sm:text-sm">Verified:</span>
              <span className="text-sm font-medium text-heading sm:text-base">{order?.customer?.isVerified ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-body sm:text-sm">Role:</span>
              <span className="text-sm font-medium text-heading sm:text-base">{order?.customer?.permission?.type_name ? order?.customer?.permission?.type_name : 'Customer'}</span>
            </div>
          </div>
        </div>
      </Card>

      {order?.customer?.permission?.type_name === DEALER && (
        <DispatchModal
          isOpen={isDispatchModalOpen}
          onClose={() => setDispatchModalOpen(false)}
          order={stockOrderData}
          dealerId={dealerId}
          updateDispatch={handleDispatchUpdate}
        />
      )}
    </>
  );
}

OrderDetailsPage.Layout = Layout;

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['table', 'common', 'form', 'order'])),
    },
  };
}