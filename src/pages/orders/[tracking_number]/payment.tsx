import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PaymentStatus } from '@/types';
import { useOrder } from '@/framework/rest/order';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Spinner from '@/components/ui/loader/spinner/spinner';
import Order from '@/components/order/order-view';
import Layout from '@/components/layouts/admin';

export { getServerSideProps } from '@/framework/rest/order.ssr';

export default function OrderPage() {
    const { openModal } = useModalAction();
    const { query } = useRouter();
    const trackingNumber = query.tracking_number?.toString();

    const { order, isLoading, isFetching } = useOrder({
        tracking_number: trackingNumber!,
    });

    console.log('Order Data:', order);

    const { payment_status, payment_intent, tracking_number } = order ?? {};

    console.log('Payment Intent:', payment_intent);

    const isPaymentModalEnabled =
        payment_status === PaymentStatus.PENDING &&
        payment_intent?.[0] &&
        !payment_intent[0]?.is_redirect;

    useEffect(() => {
        if (isPaymentModalEnabled) {
            if (!payment_intent?.[0]) {
                console.error('Payment intent is missing or invalid');
                return;
            }

            const paymentIntentInfo = payment_intent[0];
            const trackingNumberToUse = tracking_number || paymentIntentInfo.order_id;

            if (!trackingNumberToUse) {
                console.error('Tracking number is missing');
                return;
            }

            openModal('PAYMENT_MODAL', {
                paymentGateway: paymentIntentInfo.payment_gateway,
                paymentIntentInfo: paymentIntentInfo,
                trackingNumber: trackingNumberToUse,
            });
        }
    }, [isPaymentModalEnabled, payment_intent, tracking_number, openModal]);

    if (isLoading) {
        return <Spinner showText={false} />;
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <>
            <Order order={order} loadingStatus={!isLoading && isFetching} />
        </>
    );
}

OrderPage.getLayout = Layout;