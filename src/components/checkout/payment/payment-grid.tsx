import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import CashOnDelivery from '@/components/checkout/payment/cash-on-delivery';
import { useAtom } from 'jotai';
import cn from 'classnames';
import { PaymentGateway } from '@/types';
import PaymentOnline from '@/components/checkout/payment/payment-online';
import PaymentSubGrid from './payment-sub-grid';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';
import { paymentGatewayAtom } from '@/contexts/checkout';
import Spinner from '@/components/ui/loader/spinner/spinner';
import { useSettingsQuery } from '@/data/settings';
import { useRouter } from 'next/router';

interface PaymentSubGateways {
  name: string;
  value: string;
}
interface PaymentMethodInformation {
  name: string;
  value: PaymentGateway;
  icon: any;
  component: React.FunctionComponent;
}

interface PaymentGroupOptionProps {
  payment: PaymentMethodInformation;
  theme?: string;
}

// const PAYMENT_GATEWAYS = [
//   { name: 'stripe', title: 'Stripe' },
//   { name: 'paypal', title: 'Paypal' },
//   { name: 'razorpay', title: 'RazorPay' },
// ];

const PaymentGroupOption: React.FC<PaymentGroupOptionProps> = ({
  payment: { name, value, icon },
  theme,
}) => {
  return (
    <RadioGroup.Option value={value} key={value}>
      {({ checked }) => (
        <div
          className={cn(
            'relative flex h-full w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-light p-3 text-center',
            checked && '!border-accent bg-light shadow-600',
            {
              '!border-gray-800 bg-light shadow-600': theme === 'bw' && checked,
            }
          )}
        >
          {icon ? (
            <>{icon}</>
          ) : (
            <span className="text-xs font-semibold text-heading">{name}</span>
          )}
        </div>
      )}
    </RadioGroup.Option>
  );
};

const PaymentGrid: React.FC<{ className?: string; theme?: 'bw' }> = ({
  className,
  theme,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gateway, setGateway] = useAtom(paymentGatewayAtom);
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  // const { settings,loading ,error } = useSettingsQuery();
  const {
    // @ts-ignore
    settings: { options }, loading: { isLoading }
  } = useSettingsQuery({
    language: locale!,
  });


  console.log('options-PAYMENT-GRID',options)
  // If no payment gateway is set and cash on delivery also disable then cash on delivery will be on by default
  const isEnableCashOnDelivery =
    (!options?.useCashOnDelivery && !options?.paymentGateway) ||
    options?.useCashOnDelivery;

  // default payment gateway
  // const defaultPaymentGateway = settings?.defaultPaymentGateway.toUpperCase();

  const [defaultGateway, setDefaultGateway] = useState(
    options?.defaultPaymentGateway?.toUpperCase() || ''
  );
  const [cashOnDelivery, setCashOnDelivery] = useState(
    (!options?.useCashOnDelivery && !options?.paymentGateway) ||
    options?.useCashOnDelivery
  );
  const [availableGateway, setAvailableGateway] = useState(
    options?.paymentGateway || []
  );
   console.log("paymentride",availableGateway)
  // FixME
  // @ts-ignore
  const AVAILABLE_PAYMENT_METHODS_MAP: Record<
    PaymentGateway,
    PaymentMethodInformation
  > = {
    STRIPE: {
      name: 'Stripe',
      value: PaymentGateway.STRIPE,
      icon: <StripeIcon />,
      component: PaymentOnline,
    },
    PAYPAL: {
      name: 'Paypal',
      value: PaymentGateway.PAYPAL,
      icon: <PayPalIcon />,
      // icon: '/payment/paypal.png',
      component: PaymentOnline,
    },
    RAZORPAY: {
      name: 'RazorPay',
      value: PaymentGateway.RAZORPAY,
      icon: <RazorPayIcon />,
      component: PaymentOnline,
    },

    CASH_ON_DELIVERY: {
      name: t('text-cash-on-delivery'),
      value: PaymentGateway.COD,
      icon: '',
      component: CashOnDelivery,
    },
  };

  useEffect(() => {
    if (options && availableGateway) {
      setGateway(
        options?.defaultPaymentGateway?.toUpperCase() as PaymentGateway
      );
    } else {
      setGateway(PaymentGateway.COD);
    }
  }, [isLoading, cashOnDelivery, defaultGateway, availableGateway]);

  const PaymentMethod = AVAILABLE_PAYMENT_METHODS_MAP[gateway];
  const Component = PaymentMethod?.component ?? CashOnDelivery;

  let payment_sub_gateway: PaymentSubGateways[] = [];

  if (isLoading) {
    return <Spinner showText={false} />;
  }
  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-base font-semibold text-heading">
          {t('text-choose-payment')}
        </RadioGroup.Label>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {options?.paymentGateway?.map(({ name }: { name: string }, index: number) => (
            <Fragment key={index}>
              <PaymentGroupOption
                theme={theme}
                payment={AVAILABLE_PAYMENT_METHODS_MAP[name.toUpperCase() as PaymentGateway]}
              />
            </Fragment>
          ))}


          {cashOnDelivery && (
            <PaymentGroupOption
              theme={theme}
              payment={AVAILABLE_PAYMENT_METHODS_MAP[PaymentGateway.COD]}
            />
          )}
        </div>
      </RadioGroup>

      <PaymentSubGrid
        theme={theme}
        gateway={gateway}
        paymentSubGateway={payment_sub_gateway}
      />

      <div>
        <Component />
      </div>
    </div>
  );
};

export default PaymentGrid;