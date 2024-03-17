import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import { formatString } from '@/utils/format-string';
import usePrice from '@/utils/use-price';
import { useUI } from '@/contexts/ui.context';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import { useStock } from '@/contexts/quick-cart/stock.context';

const StockCounterButton = () => {
  const { t } = useTranslation();
  const { totalUniqueItems, total } = useStock();
  const { openCartSidebar } = useUI();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  return (
    <button
      className="product-cart shadow-900 fixed top-1/2 z-40 -mt-12 flex flex-col items-center justify-center rounded bg-accent p-3 pt-3.5 text-sm font-semibold text-light transition-colors duration-200 rounded-te-none rounded-be-none hover:bg-accent-hover focus:outline-none ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto"
      onClick={openCartSidebar}
    >
      <span className="flex pb-0.5">
        <CartCheckBagIcon className="flex-shrink-0" width={14} height={16} />
        <span className="flex ms-2">
          {formatString(totalUniqueItems, t('common:text-item'))}
        </span>
      </span>
      <span className="mt-3 w-full rounded bg-light py-2 px-2 text-accent">
        {totalPrice}
      </span>
    </button>
  );
};

export default StockCounterButton;
