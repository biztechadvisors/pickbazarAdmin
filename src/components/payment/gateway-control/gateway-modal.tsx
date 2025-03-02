import { Fragment, useEffect, useState } from 'react';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useSettings } from '@/framework/rest/settings';
import { useTranslation } from 'next-i18next';
import { useGetPaymentIntent } from '@/framework/rest/order';
import Button from '@/components/ui/button';
import { RadioGroup } from '@headlessui/react';
import cn from 'classnames';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';

interface Props {
  buttonSize?: 'big' | 'medium' | 'small';
}

const PaymentGateways: React.FC<{
  theme?: 'bw';
  settings: any;
  order: any;
  isLoading: boolean;
}> = ({ theme, settings, order, isLoading }) => {
  const icon: any = {
    stripe: <StripeIcon />,
    paypal: <PayPalIcon />,
    razorpay: <RazorPayIcon />,
  };

  // default payment gateway
  // const defaultPaymentGateway = settings?.defaultPaymentGateway.toUpperCase();

  let temp_gateways = settings?.paymentGateway;

  return (
    <>
      {temp_gateways?.map((gateway: any, index: number) => {
        // check and set disabled already chosen gateway
        let disabledSelection = false;
        if (gateway?.name.toUpperCase() === order?.payment_gateway) {
          disabledSelection = true;
        }

        return (
          <RadioGroup.Option
            value={gateway}
            key={index}
            disabled={disabledSelection || isLoading}
          >
            {({ checked }) => (
              <div
                className={cn(
                  'relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-light bg-gray-100 text-center',
                  checked && '!border-accent bg-light shadow-md',
                  disabledSelection || isLoading
                    ? 'pointer-events-none cursor-not-allowed opacity-60'
                    : '',
                  disabledSelection ? '!border-accent shadow-md' : ''
                )}
              >
                <span className="block w-full pb-[52%]">
                  <span className="absolute flex h-full w-full items-center justify-center p-6 md:p-9">
                    {icon[gateway?.name]}
                  </span>
                  {disabledSelection && (
                    <span className="absolute -top-7 -right-7 flex h-14 w-14 rotate-45 items-end justify-center bg-accent p-2 text-white">
                      {/* <StarIcon className="h-auto w-2.5" /> */}
                    </span>
                  )}
                </span>
              </div>
            )}
          </RadioGroup.Option>
        );
      })}
    </>
  );
};

const GatewayModal: React.FC<Props> = ({ buttonSize = 'small' }) => {
  const { t } = useTranslation('common');
  const {
    isOpen,
    data: { order },
  } = useModalState();
  const { closeModal } = useModalAction();
  const [gateway, setGateway] = useState(order?.payment_gateway || '');
  const shopSlug = typeof window !== 'undefined' ? localStorage.getItem("shopSlug") : null;

  const { settings } = useSettings(shopSlug);
  const { isLoading, getPaymentIntentQuery } = useGetPaymentIntent({
    tracking_number: order?.tracking_number as string,
    payment_gateway: gateway?.name?.toUpperCase() as string,
    recall_gateway: true,
    //@ts-ignore
    form_change_gateway: true,
  });

  const handleSubmit = async () => {
    await getPaymentIntentQuery();
  };

  // check and set disabled already chosen gateway
  let disabledSelection = false;
  if (!gateway) {
    disabledSelection = true;
  }
  disabledSelection = gateway === order?.payment_gateway;
  return (
    <Fragment>
      <div className="payment-modal relative h-full w-screen max-w-md overflow-hidden rounded-[10px] bg-light md:h-auto md:min-h-0 lg:max-w-[46rem]">
        <div className="p-6 lg:p-12">
          <RadioGroup value={gateway} onChange={setGateway}>
            <RadioGroup.Label className="mb-5 block text-lg font-semibold text-heading">
              Choose Another Payment Gateway
            </RadioGroup.Label>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              <PaymentGateways
                theme="bw"
                settings={settings}
                order={order}
                isLoading={!!isLoading}
              />
            </div>
          </RadioGroup>

          <Button
            className="w-full"
            onClick={handleSubmit}
            // size={}
            disabled={disabledSelection || !!isLoading}
            loading={isLoading}
          >
            Submit Payment
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default GatewayModal;
