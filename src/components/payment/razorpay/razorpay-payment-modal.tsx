import { useCallback, useEffect, useState } from 'react';
import useRazorpay, { RazorpayOptions } from '@/lib/use-razorpay';
import { formatAddress } from '@/lib/format-address';
import { PaymentGateway, PaymentIntentInfo } from '@/types';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useSettings } from '@/framework/rest/settings';
import { useOrder, useOrderPayment } from '@/framework/rest/order';
import client from '@/framework/rest/client';
import Spinner from '@/components/ui/loader/spinner/spinner';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface Props {
  paymentIntentInfo: PaymentIntentInfo;
  trackingNumber: string;
  paymentGateway: PaymentGateway;
}

const RazorpayPaymentModal: React.FC<Props> = ({
  trackingNumber,
  paymentIntentInfo,
  paymentGateway,
}) => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const trackingNumberDef = query.tracking_number?.toString();
  const { closeModal } = useModalAction();
  const { loadRazorpayScript, checkScriptLoaded } = useRazorpay();
  const shopSlug = typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;
  const { settings, isLoading: isSettingsLoading } = useSettings(shopSlug);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  if (!trackingNumber && !trackingNumberDef) {
    throw new Error('Tracking number is required');
  }

  const { order, isLoading, refetch } = useOrder({
    tracking_number: trackingNumber ?? trackingNumberDef,
  });

  const { createOrderPayment } = useOrderPayment();

  const { customer_name, customer_contact, customer, billing_address } = order ?? {};

  const paymentHandle = useCallback(async () => {
    if (!checkScriptLoaded()) {
      await loadRazorpayScript();
      setIsScriptLoaded(true);
    }

    const __DEV__ = document.domain === 'localhost';
    const options: RazorpayOptions = {
      key: __DEV__ ? 'rzp_test_5pZjAxubHkUaGo' : 'm2eUDWAactAclyIvFABxZ1Kh',
      amount: paymentIntentInfo?.amount!,
      currency: paymentIntentInfo?.currency!,
      name: customer_name!,
      description: `${t('text-order')}#${trackingNumber}`,
      image: settings?.logo?.original!,
      order_id: paymentIntentInfo?.order_id!,
      handler: async (response) => {
        closeModal();
        try {
          const paymentIntentInfo = await client.orders.savePaymentId(response);
          await createOrderPayment({
            tracking_number: trackingNumber,
            payment_gateway: paymentGateway,
            paymentIntentInfo: paymentIntentInfo,
          });
          toast.success(t('common:payment-successful'));
        } catch (error) {
          console.error('Error saving payment ID:', error);
          toast.error(t('common:error-saving-payment'));
        }
      },
      prefill: {
        ...(customer_name && { name: customer_name }),
        ...(customer_contact && { contact: `+${customer_contact}` }),
        ...(customer?.email && { email: customer?.email }),
      },
      notes: {
        address: formatAddress(billing_address as any),
      },
      modal: {
        ondismiss: async () => {
          closeModal();
          await refetch();
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }, [
    checkScriptLoaded,
    loadRazorpayScript,
    paymentIntentInfo,
    customer_name,
    trackingNumber,
    settings?.logo?.original,
    t,
    closeModal,
    createOrderPayment,
    paymentGateway,
    customer_contact,
    customer?.email,
    billing_address,
    refetch,
  ]);

  useEffect(() => {
    if (!isLoading && !isSettingsLoading && isScriptLoaded) {
      paymentHandle();
    }
  }, [isLoading, isSettingsLoading, isScriptLoaded, paymentHandle]);

  if (isLoading || isSettingsLoading || !isScriptLoaded) {
    return <Spinner showText={false} />;
  }

  return null;
};

export default RazorpayPaymentModal;