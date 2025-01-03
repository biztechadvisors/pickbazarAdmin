// import { useTranslation } from 'next-i18next';
// // import {
// //   useStripe,
// //   useElements,
// //   Elements,
// //   CardNumberElement,
// // } from '@stripe/react-stripe-js';
// import { useState } from 'react';
// import { Elements } from '@stripe/react-stripe-js'; 
// import { useOrderPayment, useSavePaymentMethod } from '@/framework/rest/order';
// import { toast } from 'react-toastify';
// import { useModalAction } from '@/components/ui/modal/modal.context';
// import { PaymentGateway, PaymentIntentInfo } from '@/types';
// import StripeBaseForm from '@/components/payment/stripe/stripe-base-form';
// import getStripe from '@/lib/get-stripejs';
// import StripeElementForm from '@/components/payment/stripe/stripe-element-base-form';
// // import { StripeElementsOptions } from '@stripe/stripe-js';
// import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';

// interface Props {
//   paymentIntentInfo: PaymentIntentInfo;
//   trackingNumber: string;
//   paymentGateway: PaymentGateway;
// }

// const PaymentForm: React.FC<Props> = ({
//   paymentIntentInfo,
//   trackingNumber,
//   paymentGateway,
// }) => {
//   const { t } = useTranslation('common');
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [saveCard, setSaveCard] = useState(false);
//   const { closeModal } = useModalAction();
//   const { createOrderPayment } = useOrderPayment();
//   const { savePaymentMethod } = useSavePaymentMethod();
//   const [cardError, setCardError] = useState('');

//   const handleSubmit = async (event: any) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }
//     const cardElement = elements.getElement(CardNumberElement)!;
//     setLoading(true);
//     if (saveCard) {
//       const { error: paymentMethodError, paymentMethod } =
//         await stripe.createPaymentMethod({
//           type: 'card',
//           card: cardElement,
//           billing_details: {
//             name: event?.target?.owner_name?.value as string,
//           },
//         });

//       if (paymentMethodError) {
//         setCardError(paymentMethodError?.message as string);
//         setLoading(false);
//       } else {
//         await savePaymentMethod(
//           {
//             method_key: paymentMethod?.id as string,
//             payment_intent: paymentIntentInfo?.payment_id as string,
//             save_card: saveCard as boolean,
//             tracking_number: trackingNumber as string,
//             payment_gateway: 'stripe' as string,
//           },
//           {
//             onSuccess: async (payload: any) => {
//               const confirmCardPayment = await stripe.confirmCardPayment(
//                 paymentIntentInfo?.client_secret!,
//                 {
//                   payment_method: payload.method_key,
//                   setup_future_usage: 'on_session',
//                 }
//               );
//               // Send card response to the api\
//               await createOrderPayment({
//                 tracking_number: trackingNumber as string,
//                 payment_gateway: 'stripe' as string,
//               });
//               if (confirmCardPayment?.paymentIntent?.status === 'succeeded') {
//                 //@ts-ignore
//                 toast.success(t('payment-successful'));
//                 setLoading(false);
//                 closeModal();
//               } else {
//                 setCardError(confirmCardPayment?.error?.message as string);
//                 setLoading(false);
//               }
//             },
//           }
//         );
//       }
//     } else {
//       const confirmCardPayment = await stripe.confirmCardPayment(
//         paymentIntentInfo?.client_secret!,
//         {
//           payment_method: {
//             card: cardElement,
//           },
//         }
//       );
//       // Send card response to the api
//       await createOrderPayment({
//         tracking_number: trackingNumber,
//         payment_gateway: 'stripe' as string,
//       });
//       if (confirmCardPayment?.paymentIntent?.status === 'succeeded') {
//         //@ts-ignore
//         toast.success(t('payment-successful'));
//         setLoading(false);
//         closeModal();
//       } else {
//         setCardError(confirmCardPayment?.error?.message as string);
//         setLoading(false);
//       }
//     }
//   };

//   function changeSaveCard() {
//     setSaveCard(!saveCard);
//   }

//   return (
//     <StripeBaseForm
//       handleSubmit={handleSubmit}
//       type={'checkout'}
//       loading={loading}
//       cardError={cardError}
//       changeSaveCard={changeSaveCard}
//       saveCard={saveCard}
//     />
//   );
// };

// const StripePaymentForm: React.FC<Props> = ({
//   paymentGateway,
//   paymentIntentInfo,
//   trackingNumber,
// }) => {
//   let onlyCard = false; // eita ashbe settings theke

//   const clientSecret = paymentIntentInfo?.client_secret;

//   const options: StripeElementsOptions = {
//     clientSecret,
//     appearance: {
//       theme: "stripe",
//     },
//   };

//   return (
//     <>
//       <Elements stripe={getStripe()}>
//         <PaymentForm
//           paymentIntentInfo={paymentIntentInfo}
//           trackingNumber={trackingNumber}
//           paymentGateway={paymentGateway}
//         />
//       </Elements>
//     </>
//   );
// };

// export default StripePaymentForm;