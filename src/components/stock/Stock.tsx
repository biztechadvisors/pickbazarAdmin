import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/item';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { formatString } from '@/utils/format-string';
import { useTranslation } from 'next-i18next';
import { useUI } from '@/contexts/ui.context';
import { Routes } from '@/config/routes';
import usePrice from '@/utils/use-price';
import { useCart } from '@/contexts/quick-cart/cart.context';
import CheckoutForm from '../checkout/CheckoutForm';
import { useMeQuery } from '@/data/user';
import { useStock } from '@/contexts/quick-cart/stock.context';
import StockItem from './stock-items';
// import { drawerAtom } from '@store/drawer-atom';

const Stock = () => {
  const { t } = useTranslation('common');
  const { items, totalUniqueItems, total } = useStock();
  const { closeCartSidebar } = useUI();

  // const [_, closeSidebar] = useAtom(drawerAtom);
  const router = useRouter();

  function handleCheckout() {
    // const regularCheckout = items.find((item) => item.is_digital === false);
    // if (regularCheckout) {
    router.push(Routes.checkouts);
    // } else {
    // router.push(ROUTES.CHECKOUT_DIGITAL);
    // }

    // closeSidebar({ display: false, view: '' });
  }

  const { price: totalPrice } = usePrice({
    amount: total,
  });

  console.log("totalPrice",totalPrice)

  const { data: meData } = useMeQuery();

  const { id, email, contact } = meData || {};
  return (
    <section className="relative flex h-full flex-col bg-white">
      <header className="fixed top-0 z-10 flex h-16 w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light px-6">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="flex-shrink-0" width={24} height={22} />
          <span className="flex ms-2">
            {formatString(totalUniqueItems, t('text-item'))}
          </span>
        </div>
        <button
          onClick={closeCartSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 -me-2 ms-3 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      {/* End of cart header */}

      <motion.div layout className="flex-grow pb-20">
        {items.length > 0 ? (
          items?.map((item) => (
            <StockItem
              item={item}
              key={item.id}
              id={id}
              email={email}
              phone={contact}
            />
          ))
        ) : (
          <motion.div
            layout
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className="flex h-full flex-col items-center justify-center"
          >
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {t('text-no-products')}
            </h4>
          </motion.div>
        )}
      </motion.div>
      {/* End of cart items */}

      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light px-6 py-5">
        {/* <CheckoutForm/> */}
        <br />
        <button
          className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
          onClick={handleCheckout}
        >
          <span className="flex h-full flex-1 items-center px-5 text-light">
            {t('text-checkout')}
          </span>
          <span className="flex h-full flex-shrink-0 items-center rounded-full bg-light px-5 text-accent">
            {totalPrice}
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};

export default Stock;
