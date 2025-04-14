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
import { useStock } from '@/contexts/quick-cart/stock.context';
import {
  useDownloadInvoiceMutation,
  useUpdateOrderMutation,
} from '@/data/order';
import { useFetchStockOrderData, useOrderSalesQuery } from '@/data/stocks';
import { siteSettings } from '@/settings/site.settings';
import { Attachment, OrderStatus, PaymentStatus } from '@/types';
import { formatAddress } from '@/utils/format-address';
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
import DispatchModal from '@/components/ui/modal-component/dispatch-modal';
import { useMeQuery } from '@/data/user';
import { Company } from '@/utils/constants';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight } = useIsRTL();
  const { resetStock } = useStock();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [isDispatchModalOpen, setDispatchModalOpen] = useState(false);

  useEffect(() => {
    resetStock();
    resetCheckout();
  }, [resetStock, resetCheckout]);

  const { orderId } = query;
  const { data: meData } = useMeQuery();

  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();

  const {
    order,
    isLoading: loading,
    error,
  } = useOrderSalesQuery({ id: query.orderId as string, soldBy: meData?.id, language: locale! });

  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: query.orderId as string,
      isRTL: alignLeft === 'left',
      language: locale!,
    },
    { enabled: false }
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { order_status: order?.order_status ?? '' },
  });

  const ChangeStatus = ({ order_status }: { order_status: any }) => {
    updateOrder({
      id: order?.id as string,
      order_status: order_status?.status as string,
    });
  };

  const { price: sub_total } = usePrice({ amount: order?.amount! });
  const { price: total } = usePrice({ amount: order?.paid_total! });

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
            alt="Product"
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
            {item?.pivot?.order_quantity}
          </span>
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      render: (_: any, item: any) => {
        const { price } = usePrice({ amount: parseFloat(item?.pivot?.subtotal) });
        return <span>{price}</span>;
      },
    },
  ];

  // const DispatchButton = meData?.permission.type_name === Company;

  return (
    <>
      <Card>
        <OrderViewHeader order={order} wrapperClassName="px-8 py-4" />

        <div className="flex justify-between items-center my-4">
          <Button onClick={handleDownloadInvoice} className="bg-blue-500">
            <DownloadIcon className="h-4 w-4 me-2" />
            {t('common:text-download')} {t('common:text-invoice')}
          </Button>

          {order?.order_status !== OrderStatus.FAILED && order?.order_status !== OrderStatus.CANCELLED && (
            <form onSubmit={handleSubmit(ChangeStatus)} className="flex gap-2 items-center">
              <SelectInput
                name="order_status"
                control={control}
                getOptionLabel={(option: any) => t(option.name)}
                getOptionValue={(option: any) => option.status}
                options={ORDER_STATUS.slice(0, 6)}
                placeholder={t('form:input-placeholder-order-status')}
              />
              <Button loading={updating} type="submit">
                {t('form:button-label-change-status')}
              </Button>
            </form>
          )}

          {/* <Button onClick={() => setDispatchModalOpen(true)}>
            {DispatchButton ? t('form:button-label-change-dispatch') : t('Received')}
          </Button> */}
        </div>

        <OrderStatusProgressBox
          orderStatus={order?.order_status as OrderStatus}
          paymentStatus={order?.payment_status as PaymentStatus}
        />

        <Table
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={order?.products!}
          rowKey="id"
          scroll={{ x: 300 }}
        />

        <div className="mt-6 w-full sm:w-1/2 md:w-1/3 border-t-4 border-double border-border-200 px-4 py-4">
          <div className="flex justify-between text-sm">
            <span>{t('common:order-sub-total')}</span>
            <span>{sub_total}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>{t('common:order-total')}</span>
            <span>{total}</span>
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
              <span className="text-sm font-medium text-heading sm:text-base">{order?.customer?.permission?.type_name}</span>
            </div>
          </div>
        </div>
      </Card>

    </>
  );
}

// OrderDetailsPage.authenticate = true;
OrderDetailsPage.Layout = Layout;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
  };
}
