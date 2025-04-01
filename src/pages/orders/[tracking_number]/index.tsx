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
import {
    useDownloadInvoiceMutation,
    useOrderQuery,
    useUpdateOrderMutation,
} from '@/data/order';
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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
    order_status: any;
};
export default function OrderDetailsPage() {
    const { t } = useTranslation();
    const { query, locale } = useRouter();
    const { alignLeft, alignRight, isRTL } = useIsRTL();
    const { resetCart } = useCart();
    const [, resetCheckout] = useAtom(clearCheckoutAtom);

    useEffect(() => {
        resetCart();
        // @ts-ignore
        resetCheckout();
    }, [resetCart, resetCheckout]);
    // Error

    const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();

    const orderId = query.orderId || (query.tracking_number as string);
    const { order, isLoading: loading, error } = useOrderQuery({
        id: orderId,
        language: locale!,
    });

    const { refetch } = useDownloadInvoiceMutation(
        {
            order_id: query.orderId as string,
            isRTL,
            language: locale!,
        },
        { enabled: false }
    );

    const {
        handleSubmit,
        control,

        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: { order_status: order?.order_status ?? '' },
    });

    const ChangeStatus = ({ order_status }: FormValues) => {
        console.log("status update-order ", order_status)
        updateOrder({
            id: order?.id as string,
            order_status: order_status?.status as string,
        });
    };
    const { price: subtotal } = usePrice(
        order && {
            amount: order?.amount!,
        }
    );

    const { price: total } = usePrice(
        order && {
            amount: order?.paid_total!,
        }
    );
    const { price: discount } = usePrice(
        order && {
            amount: order?.discount! ?? 0,
        }
    );
    const { price: delivery_fee } = usePrice(
        order && {
            amount: order?.delivery_fee!,
        }
    );
    const { price: sales_tax } = usePrice(
        order && {
            amount: order?.sales_tax!,
        }
    );
    const { price: sub_total } = usePrice({ amount: order?.amount! });
    const { price: shipping_charge } = usePrice({
        amount: order?.delivery_fee ?? 0,
    });
    const { price: wallet_total } = usePrice({
        // @ts-ignore
        amount: order?.wallet_point?.amount!,
    });

    const totalItem = order?.products?.reduce(
        // @ts-ignore
        (initial = 0, p) => initial + parseInt(p?.pivot?.order_quantity!),
        0
    );

    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message={error.message} />;


    async function handleDownloadInvoice() {
        const { data } = await refetch();

        if (data) {
            const a = document.createElement('a');
            a.href = data;
            a.setAttribute('download', 'order-invoice');
            a.click();
        }
    }

    const columns = [
        {
            dataIndex: 'image',
            key: 'image',
            width: 70,
            render: (image: Attachment) => (
                <div className="relative h-[50px] w-[50px]">
                    <Image
                        src={image?.thumbnail ?? siteSettings.product.placeholder}
                        alt="alt text"
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className="object-fill"
                    />
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
                    <span className="font-semibold text-heading">
                        {item.order_quantity}
                    </span>
                </div>
            ),
        },
        {
            title: t('table:table-item-total'),
            dataIndex: 'price',
            key: 'price',
            align: alignRight,
            render: function Render(_: any, item: any) {
                const { price } = usePrice({
                    amount: parseFloat(item.subtotal),
                });
                return <span>{price}</span>;
            },
        },
    ];

   
    return (
      <>
        <Card className="relative overflow-hidden">
          {/* Header - Made responsive */}
          <div className="mb-4 -mt-4 -ml-4 -mr-4 md:-mt-6 md:-ml-6 md:-mr-6">
            <OrderViewHeader order={order} wrapperClassName="px-4 py-3 sm:px-6 sm:py-4" />
          </div>
  
          {/* Download Button - Adjusted for mobile */}
          <div className="flex w-full justify-center sm:justify-end">
            <Button
              onClick={handleDownloadInvoice}
              className="mb-4 bg-blue-500 sm:mb-5"
              size="small"
            >
              <DownloadIcon className="h-4 w-4 me-2" />
              <span className="text-xs sm:text-sm">
                {t('common:text-download')} {t('common:text-invoice')}
              </span>
            </Button>
          </div>
  
          {/* Order ID and Status - Made responsive */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-0">
            <h3 className="w-full text-center text-xl font-semibold text-heading sm:text-2xl lg:w-1/3 lg:text-start">
              {t('form:input-label-order-id')} - {order?.tracking_number}
            </h3>
  
            {order?.order_status !== OrderStatus.FAILED &&
              order?.order_status !== OrderStatus.CANCELLED && (
                <form
                  onSubmit={handleSubmit(ChangeStatus)}
                  className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-end lg:w-2/3"
                >
                  <div className="w-full sm:me-4 sm:w-48">
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
          </div>
  
          {/* Status Progress - Adjusted spacing */}
          <div className="my-4 flex items-center justify-center sm:my-6">
            <OrderStatusProgressBox
              orderStatus={order?.order_status as OrderStatus}
              paymentStatus={order?.payment_status as PaymentStatus}
            />
          </div>
  
          {/* Product Table - Made scrollable on mobile */}
          <div className="mb-6 overflow-x-auto sm:mb-8">
            {order ? (
              <Table
                //@ts-ignore
                columns={columns}
                emptyText={t('table:empty-table-data')}
                data={order?.products!}
                rowKey="id"
                scroll={{ x: 500 }}
                className="min-w-[600px] sm:min-w-0"
              />
            ) : (
              <span>{t('common:no-order-found')}</span>
            )}
          </div>
  
          {/* Order Summary - Made responsive */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Price Summary - Adjusted for mobile */}
            <div className="w-full lg:w-1/2 xl:w-1/3">
              <div className="rounded-lg border border-border-200 p-4">
                <h3 className="mb-3 text-lg font-semibold">{t('Order Summary')}</h3>
                {order?.parent_id ? (
                  <>
                    <div className="flex justify-between py-2 text-sm text-body">
                      <span>{t('common:order-sub-total')}</span>
                      <span>{subtotal}</span>
                    </div>
                    <div className="flex justify-between py-2 text-base font-semibold text-heading">
                      <span>{t('common:order-total')}</span>
                      <span>{total}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-2 text-sm text-body">
                      <span>{t('common:order-sub-total')}</span>
                      <span>{sub_total}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm text-body">
                      <span>{t('text-shipping-charge')}</span>
                      <span>{shipping_charge}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm text-body">
                      <span>{t('text-tax')}</span>
                      <span>{sales_tax}</span>
                    </div>
                    {order?.discount! > 0 && (
                      <div className="flex justify-between py-2 text-sm text-body">
                        <span>{t('text-discount')}</span>
                        <span>{discount}</span>
                      </div>
                    )}
                    {wallet_total && (
                      <div className="flex justify-between py-2 text-sm text-body">
                        <span>{t('text-paid-from-wallet')}</span>
                        <span>{wallet_total}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-base font-semibold text-heading">
                      <span>{t('text-total')}</span>
                      <span>{total}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
  
            {/* Address Sections - Made responsive */}
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:w-1/2 xl:w-2/3">
              <div className="rounded-lg border border-border-200 p-4">
                <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
                  {t('text-order-details')}
                </h3>
                <div className="space-y-2 text-sm text-body">
                  <div>
                    {formatString(order?.products?.length, t('text-item'))}
                  </div>
                  <div>{order?.delivery_time}</div>
                </div>
              </div>
  
              <div className="rounded-lg border border-border-200 p-4">
                <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
                  {t('common:billing-address')}
                </h3>
                <div className="space-y-2 text-sm text-body">
                  <div>{order?.customer_name}</div>
                  {order?.billing_address && (
                    <div>{formatAddress(order.billing_address)}</div>
                  )}
                  {order?.customer_contact && (
                    <div>{order?.customer_contact}</div>
                  )}
                </div>
              </div>
  
              <div className="rounded-lg border border-border-200 p-4 sm:col-span-2 lg:col-span-1">
                <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
                  {t('common:shipping-address')}
                </h3>
                <div className="space-y-2 text-sm text-body">
                  <div>{order?.customer_name}</div>
                  {order?.shipping_address && (
                    <div>{formatAddress(order.shipping_address)}</div>
                  )}
                  {order?.customer_contact && (
                    <div>{order?.customer_contact}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </>
    );
  }
  
  OrderDetailsPage.Layout = Layout;
  
  export const getServerSideProps = async ({ locale }: any) => ({
    props: {
      ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
    },
  });