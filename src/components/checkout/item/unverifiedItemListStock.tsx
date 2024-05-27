import { useCart } from '@/contexts/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import ItemCard from './item-card';
import EmptyCartIcon from '@/components/icons/empty-cart';
import usePrice from '@/utils/use-price';
import { ItemInfoRow } from './item-info-row';
import { useStock } from '@/contexts/quick-cart/stock.context';
import { CheckAvailActionStock } from '../check-avail-action-stock';

const UnverifiedItemListStock = () => {
  const { t } = useTranslation('common');
  const { items, total, isEmpty } = useStock();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col items-center space-s-4">
        <span className="text-base font-bold text-heading">
          {t('text-your-order')}
        </span>
      </div>
      <div className="flex flex-col border-b border-border-200 py-3">
        {isEmpty ? (
          <div className="mb-4 flex h-full flex-col items-center justify-center">
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {t('text-no-products')}
            </h4>
          </div>
        ) : (
          items?.map((item) => (
            <ItemCard item={item} margin={item.margin} key={item.id} />
          ))
        )}
      </div>
      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={subtotal} />
        <ItemInfoRow
          title={t('text-tax')}
          value={t('text-calculated-checkout')}
        />
        <ItemInfoRow
          title={t('text-estimated-shipping')}
          value={t('text-calculated-checkout')}
        />
      </div>
      <CheckAvailActionStock>
        {t('text-check-availability')}
      </CheckAvailActionStock>
    </div>
  );
};
export default UnverifiedItemListStock;