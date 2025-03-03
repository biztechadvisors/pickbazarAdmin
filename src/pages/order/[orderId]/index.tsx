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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMeQuery } from '@/data/user';
import { DEALER } from '@/utils/constants';

type FormValues = {
  order_status: any;
};

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const { data: me } = useMeQuery();
  const DealerShow = me?.permission.type_name === DEALER;

  useEffect(() => {
    resetCart();
    resetCheckout();
  }, [resetCart, resetCheckout]);

  // Hooks are now always called regardless of condition
  const updateOrderMutation = useUpdateOrderMutation();
  const dealerStatusChangeMutation = useDealerStatusChange();
  const mutationHooks = DealerShow ? dealerStatusChangeMutation : updateOrderMutation;
  const { mutate: updateOrder, isLoading: updating, isError, isSuccess } = mutationHooks;

  const orderStocksQuery = useOrderStocksQuery({ id: query.orderId as string, language: locale! });
  const orderQuery = useOrderQuery({ id: query.orderId as string, language: locale! });
  const { order, isLoading: loading, error } = DealerShow ? orderStocksQuery : orderQuery;

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
      id: order?.id as string, // Send the dynamic order ID
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
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <OrderViewHeader order={order} wrapperClassName="px-8 py-4" />
        </div>
        <div className="flex w-full">
          <Button onClick={handleDownloadInvoice} className="mb-5 bg-blue-500 ltr:ml-auto rtl:mr-auto">
            <DownloadIcon className="h-4 w-4 me-3" />
            {t('common:text-download')} {t('common:text-invoice')}
          </Button>
        </div>
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
        </div>
        <div className="mt-10 flex flex-col lg:flex-row">
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
                {formatString(t('common:text-ordered-on'), order?.created_at)}
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