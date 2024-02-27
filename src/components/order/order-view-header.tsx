// import { useTranslation } from 'next-i18next';
// import { useModalAction } from '@/components/ui/modal/modal.context';
// import { OrderStatus, PaymentGateway, PaymentStatus } from '@/types';
// import Button from '@/components/ui/button';
// import cn from 'classnames';
// import StatusColor from '@/components/order/status-color';
// import Badge from '@/components/ui/badge/badge';

// interface OrderViewHeaderProps {
//   order: any;
//   wrapperClassName?: string;
//   buttonSize?: 'big' | 'medium' | 'small';
// }

// export default function OrderViewHeader({
//   order,
//   wrapperClassName = 'px-11 py-5',
//   buttonSize = 'medium',
// }: OrderViewHeaderProps) {
//   const { t } = useTranslation('common');
//   const isPaymentCOD = [PaymentGateway.COD, PaymentGateway.CASH].includes(order?.payment_gateway);
//   const isOrderPending = ![OrderStatus.CANCELLED, OrderStatus.FAILED].includes(order?.order_status);
//   const isPaymentActionPending = !isPaymentCOD && isOrderPending && order?.payment_status !== PaymentStatus.SUCCESS;

//   return (
//     <div className={cn(`bg-[#F7F8FA] ${wrapperClassName}`)}>
//       <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
//         <div
//           className={`order-2 flex  w-full gap-6 sm:order-1 ${
//             !isPaymentActionPending
//               ? 'max-w-full basis-full justify-between'
//               : 'max-w-full basis-full justify-between lg:ltr:mr-auto'
//           }`}
//         >
//           <div>
//             <span className="mb-2 block lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
//               {t('text-order-status')} :
//             </span>
//             <Badge
//               text={t(order?.order_status)}
//               color={StatusColor(order?.order_status)}
//             />
//           </div>
//           <div>
//             <span className="mb-2 block lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
//               {t('text-payment-status')} :
//             </span>
//             <Badge
//               text={t(order?.payment_status)}
//               color={StatusColor(order?.payment_status)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import StatusColor from '@/components/order/status-color';
import Badge from '@/components/ui/badge/badge';
import PayNowButton from '@/components/payment/pay-now-button';
import { isPaymentPending } from '@/lib/is-payment-pending';
import ChangeGateway from '@/components/payment/gateway-control/change-gateway';
import { useSettings } from '@/framework/rest/settings';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useModalState } from '@/components/ui/modal/modal.context';
import { SpinnerLoader } from '../ui/loader/spinner/spinner';

interface OrderViewHeaderProps {
  order: any;
  wrapperClassName?: string;
  buttonSize?: 'big' | 'medium' | 'small';
  loading?: boolean;
}

export default function OrderViewHeader({
  order,
  wrapperClassName = 'lg:px-11 lg:py-5 p-6',
  buttonSize = 'medium',
  loading = false,
}: OrderViewHeaderProps) {
  const { settings, isLoading } = useSettings();
  const { t } = useTranslation('common');
  const isPaymentActionPending = isPaymentPending(
    order?.payment_gateway,
    order?.order_status,
    order?.payment_status
  );
  const { paymentGateway } = settings;

  return (
    <div className={cn(`bg-[#F7F8FA] ${wrapperClassName}`)}>
      <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
        <div
          className={`order-2 flex w-full gap-6 xs:flex-nowrap sm:order-1 ${
            !isPaymentActionPending
              ? 'max-w-full basis-full justify-between'
              : 'max-w-full basis-full justify-between lg:ltr:mr-auto'
          }`}
        >
          <div className="flex flex-wrap items-center">
            <span className="mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-order-status')} :
            </span>
            <div className="w-full lg:w-auto">
              {loading ? (
                <SpinnerLoader />
              ) : (
                <Badge
                  text={t(order?.order_status)}
                  color={StatusColor(order?.order_status)}
                  className="min-h-[2rem] items-center justify-center text-[9px] !leading-none xs:text-sm"
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <span className="mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-payment-status')} :
            </span>
            <div className="w-full lg:w-auto">
              {loading ? (
                <SpinnerLoader />
              ) : (
                <Badge
                  text={t(order?.payment_status)}
                  color={StatusColor(order?.payment_status)}
                  className="min-h-[2rem] items-center justify-center text-[9px] !leading-none xs:text-sm"
                />
              )}
            </div>
          </div>
        </div>
        {!isLoading && !isEmpty(paymentGateway) ? (
          <>
            {isPaymentActionPending && (
              <span className="order-2 mt-5 w-full max-w-full shrink-0 basis-full sm:order-1 lg:mt-0 lg:w-auto lg:max-w-none lg:basis-auto lg:ltr:ml-auto lg:rtl:mr-auto">
                {/* <PayNowButton trackingNumber={order?.tracking_number} /> */}
                <PayNowButton
                  trackingNumber={order?.tracking_number}
                  order={order}
                />
              </span>
            )}
            {/* @ts-ignore */}
            {paymentGateway?.length > 1 && isPaymentActionPending && (
              <span className="order-2 mt-5 w-full max-w-full shrink-0 basis-full sm:order-1 lg:mt-0 lg:w-auto lg:max-w-none lg:basis-auto lg:ltr:ml-auto lg:rtl:mr-auto">
                <ChangeGateway order={order} />
              </span>
            )}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

