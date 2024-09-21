import { PaymentStatus } from '@/types';

// export const ORDER_STATUS = [
//   { name: 'text-order-pending', status: 'order-pending', serial: 1, color: 'red', language: "en" },
//   { name: 'text-order-processing', status: 'order-processing', serial: 2, color: 'red', language: "en" },
//   {
//     name: 'text-order-at-local-facility',
//     status: 'order-at-local-facility',
//     serial: 3,
//     color: 'red', language: "en"
//   },
//   {
//     name: 'text-order-out-for-delivery',
//     status: 'order-out-for-delivery',
//     serial: 4,
//     color: 'red', language: "en"
//   },
//   { name: 'text-order-completed', status: 'order-completed', serial: 5, color: 'red', language: "en" },
//   { name: 'text-order-cancelled', status: 'order-cancelled', serial: 5, color: 'red', language: "en" },
//   { name: 'text-order-refunded', status: 'order-refunded', serial: 5, color: 'red', language: "en" },
//   { name: 'text-order-failed', status: 'order-failed', serial: 5, color: 'red', language: "en" },
// ];

export const ORDER_STATUS = [
  { name: 'text-order-pending', status: 'order-pending', serial: 1, color: 'orange', language: "en" }, // Pending
  { name: 'text-order-processing', status: 'order-processing', serial: 2, color: 'blue', language: "en" }, // Processing
  { name: 'text-order-at-local-facility', status: 'order-at-local-facility', serial: 3, color: 'purple', language: "en" }, // At Local Facility
  { name: 'text-order-out-for-delivery', status: 'order-out-for-delivery', serial: 4, color: 'yellow', language: "en" }, // Out for Delivery
  { name: 'text-order-completed', status: 'order-completed', serial: 5, color: 'green', language: "en" }, // Completed
  { name: 'text-order-cancelled', status: 'order-cancelled', serial: 6, color: 'gray', language: "en" }, // Cancelled
  { name: 'text-order-refunded', status: 'order-refunded', serial: 7, color: 'pink', language: "en" }, // Refunded
  { name: 'text-order-failed', status: 'order-failed', serial: 8, color: 'red', language: "en" }, // Failed
];


export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {
  if ([PaymentStatus.SUCCESS, PaymentStatus.COD].includes(paymentStatus)) {
    return currentStatusIndex > 4
      ? [...orderStatus.slice(0, 4), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 5);
  }

  return currentStatusIndex > 4
    ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 5);
};
