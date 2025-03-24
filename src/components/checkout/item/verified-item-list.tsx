import Coupon from '@/components/checkout/coupon';
import usePrice from '@/utils/use-price';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { calculateTotal } from '@/contexts/quick-cart/cart.utils';
import { useAtom } from 'jotai';
import { couponAtom, discountAtom, payableAmountAtom, walletAtom } from '@/contexts/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Wallet from '@/components/checkout/wallet/wallet';
import { CouponType } from '@/types';
import { useSettingsQuery } from '@/data/settings';
import { useRouter } from 'next/router';

interface Props {
  className?: string;
}

const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const { items, isEmpty: isEmptyCart } = useCart();

  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);

  const {
    settings: { options },
  } = useSettingsQuery({ language: locale! });

  // Calculate totals with proper fallbacks
  const base_amount = calculateTotal(items) || 0;
  
  // Calculate tax amount with proper fallbacks
  const totalTax = items.reduce((sum, item) => {
    const itemTaxRate = Number(item.tax_rate) || Number(options?.taxClass?.rate) || 0;
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 0;
    const itemTax = (itemPrice * itemQuantity * itemTaxRate) / (100 + itemTaxRate);
    return sum + (isNaN(itemTax) ? 0 : itemTax);
  }, 0);

  const netSubtotal = Math.max(0, base_amount - totalTax);
  
  // Ensure prices are valid numbers before formatting
  const { price: tax } = usePrice({ amount: isNaN(totalTax) ? 0 : totalTax });
  const { price: sub_total } = usePrice({ amount: isNaN(netSubtotal) ? 0 : netSubtotal });
  const { price: gross_total } = usePrice({ amount: isNaN(base_amount) ? 0 : base_amount });

  const shipping_charge = 0;
  const { price: shipping } = usePrice({ amount: shipping_charge });

  // Calculate discount with proper number handling
  let calculateDiscount = 0;
  switch (coupon?.type) {
    case CouponType.PERCENTAGE:
      calculateDiscount = (base_amount * (Number(discount) || 0)) / 100;
      break;
    case CouponType.FREE_SHIPPING:
      calculateDiscount = shipping_charge;
      break;
    default:
      calculateDiscount = Number(discount) || 0;
  }

  const { price: discountPrice } = usePrice({ 
    amount: isNaN(calculateDiscount) ? 0 : calculateDiscount 
  });

  const freeShippings = options?.freeShipping && 
    (Number(options?.freeShippingAmount) || 0) <= base_amount;
  const effectiveShippingCharge = freeShippings ? 0 : shipping_charge;

  const totalPrice = Math.max(0, 
    base_amount + effectiveShippingCharge - calculateDiscount
  );
  const { price: total } = usePrice({ 
    amount: isNaN(totalPrice) ? 0 : totalPrice 
  });

  return (
    <div className={className}>
      <div className="mb-4 flex flex-col items-center space-s-4">
        <span className="text-base font-bold text-heading">{t('text-your-order')}</span>
      </div>

      <div className="flex flex-col border-b border-border-200 pb-2">
        {!isEmptyCart ? (
          items?.map((item) => <ItemCard item={item} key={item.id} notAvailable={false} />)
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={sub_total} />
        <ItemInfoRow
          title={
            <span>
              {t('text-tax')}
              <span className="text-xs text-body"> ({t('text-included')})</span>
            </span>
          }
          value={tax}
        />
        <div className="flex justify-between">
          <p className="text-sm text-body">
            {t('text-shipping')}{' '}
            <span className="text-xs font-semibold text-accent">
              {freeShippings && `(${t('text-free-shipping')})`}
            </span>
          </p>
          <span className="text-sm text-body">{shipping}</span>
        </div>

        {discount && coupon ? (
          <div className="flex justify-between">
            <p className="flex items-center gap-1 text-sm text-body me-2">
              {t('text-discount')}
              <span className="-mt-px text-xs font-semibold text-accent">
                {coupon?.type === CouponType.FREE_SHIPPING && `(${t('text-free-shipping')})`}
              </span>
            </p>
            <span className="flex items-center text-xs font-semibold text-red-500 me-auto">
              ({coupon?.code})
              <button onClick={() => setCoupon(null)}>
                <CloseIcon className="h-3 w-3 ms-2" />
              </button>
            </span>
            <span className="flex items-center gap-1 text-sm text-body">
              {calculateDiscount > 0 ? <span className="-mt-0.5">-</span> : null} {discountPrice}
            </span>
          </div>
        ) : (
          <div className="mt-5 !mb-4 flex justify-between">
            <Coupon subtotal={base_amount} />
          </div>
        )}

        <div className="flex justify-between border-t-4 border-double border-border-200 pt-3">
          <p className="text-base font-semibold text-heading">{t('text-total')}</p>
          <span className="text-base font-semibold text-heading">{total}</span>
        </div>
      </div>

      {use_wallet && !Boolean(payableAmount) ? null : (
        <PaymentGrid className="mt-10 border border-gray-200 bg-light p-5" />
      )}

      <PlaceOrderAction>{t('text-place-order')}</PlaceOrderAction>
    </div>
  );
};

export default VerifiedItemList;