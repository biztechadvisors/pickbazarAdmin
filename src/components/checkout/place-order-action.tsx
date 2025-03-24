import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { useCreateOrder } from '@/framework/rest/order';
import ValidationError from '@/components/ui/validation-error';
import Button from '@/components/ui/button';
import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { calculateTotal } from '@/contexts/quick-cart/cart.utils';
import { checkoutAtom, discountAtom, walletAtom } from '@/contexts/checkout';
import { useTranslation } from 'next-i18next';
import { PaymentGateway } from '@/types';
import { useMeQuery } from '@/data/user';
import { useSettings } from '@/framework/rest/settings';
import { dealerAddress } from '@/utils/atoms';
import { useRouter } from 'next/router';
import { DEALER } from '@/utils/constants';

interface PlaceOrderActionProps {
  className?: string;
  children?: React.ReactNode;
}

interface OrderInput {
  products: any[];
  amount: number; // Net amount (without tax)
  discount: number;
  sales_tax: number;
  delivery_fee: number;
  total: number; // Gross amount (with tax)
  dealerId?: number;
  delivery_time?: string;
  customerId?: number;
  customer_contact: string;
  billing_customer_name: string;
  payment_gateway: PaymentGateway | string;
  payment_id?: string;
  status?: string;
  shop_id?: string | number;
  billing_address: {
    street_address?: string;
    country?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  shipping_address: {
    street_address?: string;
    country?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  language: string;
}

export const PlaceOrderAction: React.FC<PlaceOrderActionProps> = ({ className, children }) => {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading } = useCreateOrder();
  const { items } = useCart();
  const [selectedAddress] = useAtom(dealerAddress);
  const router = useRouter();

  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      customer_contact,
      customer_name,
      customer,
      payment_gateway,
      payment_sub_gateway,
      note,
      token,
      payable_amount,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);

  const { data: meData } = useMeQuery();

  let dealerId: any;
  if (meData?.permission?.type_name == DEALER) {
    dealerId = meData?.id;
  }

  const shop_id =
    meData?.shop_id ||
    meData?.createdBy.managed_shop?.id ||
    meData?.createdBy.owned_shops?.[0]?.id ||
    localStorage.getItem('shopId');

  const checkDealerId = meData?.dealer?.id;

  useEffect(() => {
    if (!selectedAddress && checkDealerId) {
      router.push({
        pathname: '/profile-update',
        query: { from: 'order-checkout' },
      });
    }
  }, [selectedAddress, router, checkDealerId]);

  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);

  // Calculate totals with proper number handling
  const grossTotal = calculateTotal(items) || 0;

  // Calculate tax with proper number handling
  const taxAmount = items.reduce((sum, item) => {
    const itemTaxRate = Number(item.tax_rate) || 0;
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 0;
    const itemTax = (itemPrice * itemQuantity * itemTaxRate) / (100 + itemTaxRate);
    return sum + (isNaN(itemTax) ? 0 : itemTax);
  }, 0);

  console.log('taxAmount ', taxAmount)

  const netAmount = Math.max(0, grossTotal - taxAmount);

  const shopSlug = typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;
  const { settings: option } = useSettings(shopSlug);
  const freeShippings = option?.freeShipping &&
    (Number(option?.freeShippingAmount) || 0) <= grossTotal;

  const shipping_charge = 0;
  const effectiveShippingCharge = freeShippings ? 0 : shipping_charge;

  const total = Math.max(0,
    grossTotal + effectiveShippingCharge - (Number(discount) || 0)
  );

  const isFullWalletPayment = use_wallet_points && payable_amount === 0;
  const gateWay = isFullWalletPayment ? PaymentGateway.FULL_WALLET_PAYMENT : payment_gateway;

  const handlePlaceOrder = () => {
    if (!customer_contact) {
      setErrorMessage('Contact Number Is Required');
      return;
    }
    if (!use_wallet_points && !payment_gateway) {
      setErrorMessage('Payment Gateway Is Required');
      return;
    }

    const orderInput: OrderInput = {
      products: items?.map((item) => formatOrderedProduct(item)),
      amount: netAmount, // Net amount without tax
      discount: discount ?? 0,
      sales_tax: taxAmount,
      delivery_fee: effectiveShippingCharge,
      total: total, // Gross total with tax
      dealerId,
      delivery_time: delivery_time?.title,
      customerId: customer?.id,
      customer_contact,
      billing_customer_name: customer?.label || customer_name,
      payment_gateway: gateWay,
      shop_id,
      billing_address: {
        street_address: billing_address?.address?.street_address,
        country: billing_address?.address?.country,
        city: billing_address?.address?.city,
        state: billing_address?.address?.state,
        zip: billing_address?.address?.zip,
      },
      shipping_address: {
        street_address: shipping_address?.address?.street_address,
        country: shipping_address?.address?.country,
        city: shipping_address?.address?.city,
        state: shipping_address?.address?.state,
        zip: shipping_address?.address?.zip,
      },
      language: 'en',
    };

    createOrder(orderInput);
  };

  const isDigitalCheckout = items.some((item) => item.is_digital);
  const formatRequiredFields = isDigitalCheckout
    ? [customer_contact, payment_gateway, items]
    : [
      customer_contact,
      payment_gateway,
      billing_address,
      shipping_address,
      delivery_time,
      items,
    ];

  const isAllRequiredFieldSelected = formatRequiredFields.every((item) => !isEmpty(item));

  return (
    <>
      <Button
        loading={isLoading}
        className={classNames('mt-5 w-full', className)}
        onClick={handlePlaceOrder}
        disabled={!isAllRequiredFieldSelected || isLoading}
      >
        {children || t('text-place-order')}
      </Button>
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </>
  );
};