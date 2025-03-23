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

  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Invoice Header */}
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <OrderViewHeader order={order} wrapperClassName="px-8 py-4" />
        </div>

        {/* Download Invoice Button */}
        <div className="flex w-full">
          <Button onClick={handleDownloadInvoice} className="mb-5 bg-blue-500 ltr:ml-auto rtl:mr-auto">
            <DownloadIcon className="h-4 w-4 me-3" />
            {t('common:text-download')} {t('common:text-invoice')}
          </Button>
        </div>

        {/* Order ID and Status */}
        <div className="flex flex-col items-center lg:flex-row">
          <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
            {t('form:input-label-order-id')} - {order?.tracking_number}
          </h3>

          {order?.order_status !== OrderStatus.FAILED &&
            order?.order_status !== OrderStatus.CANCELLED && (
              <form onSubmit={handleSubmit(ChangeStatus)} className="flex w-full items-start ms-auto lg:w-2/4">
                <div className="z-20 w-full me-5">
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
                <Button loading={updating}>
                  <span className="hidden sm:block">{t('form:button-label-change-status')}</span>
                  <span className="block sm:hidden">{t('form:form:button-label-change')}</span>
                </Button>
              </form>
            )}
          {order?.customer?.permission?.type_name === DEALER && (
            DispatchButton ? (
              <Button onClick={() => setDispatchModalOpen(true)}>
                <span className="hidden sm:block">
                  {t('form:button-label-change-dispatch')}
                </span>
                <span className="block sm:hidden">
                  {t('form:button-label-change-dispatch')}
                </span>
              </Button>
            ) : (
              <Button onClick={() => setDispatchModalOpen(true)}>
                <span className="hidden sm:block">{t('Received')}</span>
                <span className="block sm:hidden">{t('Received')}</span>
              </Button>
            )
          )}
        </div>

        {/* Invoice Body */}
        <div className="mt-10 flex flex-col lg:flex-row">
          {/* Product List */}
          <div className="w-full shrink-0 items-center lg:w-2/3 lg:pe-5 xl:w-3/4">
            <Table
              //@ts-ignore
              columns={columns}
              emptyText={t('table:empty-table-data')}
              data={order?.products}
              rowKey="id"
              scroll={{ x: 300 }}
            />
            <div className="my-5 flex w-full flex-col items-center">
              <OrderStatusProgressBox status={order?.status?.serial} />
            </div>
          </div>

          {/* Totals and Order Summary */}
          <div className="mt-10 w-full shrink-0 lg:mt-0 lg:w-1/3 xl:w-1/4">
            <div className="space-y-5">
              <div className="flex w-full justify-between text-sm text-body">
                <span>{t('common:subtotal')}</span>
                <span>{subtotal}</span>
              </div>
              <div className="flex w-full justify-between text-sm text-body">
                <span>{t('common:text-discount')}</span>
                <span>{discount}</span>
              </div>
              <div className="flex w-full justify-between text-sm text-body">
                <span>{t('common:text-delivery-fee')}</span>
                <span>{delivery_fee}</span>
              </div>
              <div className="flex w-full justify-between text-sm text-body">
                <span>{t('common:text-tax')}</span>
                <span>{sales_tax}</span>
              </div>
              <div className="flex w-full justify-between text-sm font-semibold text-heading">
                <span>{t('common:text-total')}</span>
                <span>{total}</span>
              </div>
            </div>
            <div className="mt-10 flex w-full justify-center">
              <span className="w-64">
                {formatString(t('Order Date :'), order?.created_at)}
              </span>
            </div>
            <div className="mt-4 w-full justify-center">
              {order?.shipping_address && (
                <address className="text-sm not-italic text-body">
                  {formatAddress(order?.shipping_address)}
                </address>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Details Card */}
      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-heading mb-4">Customer Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-body">Name:</span>
              <span className="text-sm text-heading">{order?.customer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-body">Email:</span>
              <span className="text-sm text-heading">{order?.customer?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-body">Contact:</span>
              <span className="text-sm text-heading">{order?.customer?.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-body">Verified:</span>
              <span className="text-sm text-heading">{order?.customer?.isVerified ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-body">Role:</span>
              <span className="text-sm text-heading">{order?.customer?.permission?.type_name}</span>
            </div>
          </div>
        </div>
      </Card>
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