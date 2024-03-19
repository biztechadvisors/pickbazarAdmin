import Image from 'next/image';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import usePrice from '@/utils/use-price';
import { CustomerData } from './add-to-cart/add-to-cart';
import { useStock } from '@/contexts/quick-cart/stock.context';

interface CartItemProps {
  item: any;
  id: number;
  email: string;
  phone: string;
}

const StockItem = ({ item, id, email, phone }: CartItemProps) => {
  const { t } = useTranslation('common');
  const { isInStock, clearItemFromCart, addItemToStock, removeItemFromStock } =
    useStock();

  const { price } = usePrice({
    amount: item.price,
  });
  const { price: itemPrice } = usePrice({
    amount: item.itemTotal,
  });

  const customerData: CustomerData = {
    customerId: id,
    email: email,
    phone: phone ? phone : '',
    cartData: item,
  };

  function handleIncrement(e: any) {
    e.stopPropagation();

    addItemToStock(
      customerData,
      1,
      customerData.customerId,
      customerData.email,
      customerData.phone
    );
  }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromStock(
      item.id,
      customerData,
      1,
      customerData.customerId,
      customerData.email,
      customerData.phone
    );
  };

  const outOfStock = !isInStock(item.id);
  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 px-4 py-4 text-sm sm:px-6"
    >
      <div className="flex-shrink-0">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div>

      <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          // src={item?.image ?? '/'}\
          src={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/${
            item?.image ?? '/'
          }`}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="font-bold text-heading">{item.name}</h3>
        <p className="my-2.5 font-semibold text-accent">{price}</p>
        <span className="text-xs text-body">
          {item.quantity} X {item.unit}
        </span>
      </div>
      <span className="font-bold text-heading ms-auto">{itemPrice}</span>
      <button
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
        onClick={() => clearItemFromCart(item.id)}
      >
        <span className="sr-only">{t('text-close')}</span>
        <CloseIcon className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default StockItem;
