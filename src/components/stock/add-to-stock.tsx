import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/cart/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/utils/cart-animation';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { generateCartItem } from '@/contexts/quick-cart/generate-cart-item';
import { useStock } from '@/contexts/quick-cart/stock.context';
import { generateStockItem } from '@/contexts/quick-cart/generate-stock-item';

interface Props {
  data: any;
  variant?: 'helium' | 'neon' | 'argon' | 'oganesson' | 'single' | 'big';
  counterVariant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
  email?: string;
  id?: number;
  phone?: string;
}

export interface CustomerData {
  customerId: number;
  email: string;
  phone: string;
  cartData: any;
  quantity: number;
}

export const AddToStock = ({
  data,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
  id,
  email,
  phone,
}: Props) => {
  const {
    addItemToStock,
    removeItemFromStock,
    isInStock,
    getItemFromStock,
    isInCart,
  } = useStock();
  const item = generateStockItem(data, variation);
  const customerData: CustomerData = {
    customerId: id,
    email: email,
    phone: phone ? phone : '',
    cartData: item,
  };

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addItemToStock(
      customerData,
      1,
      customerData.customerId,
      customerData.email,
      customerData.phone
    );

    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
  };

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

  const outOfStock = isInCart(item?.id) && !isInStock(item.id);
  return !isInCart(item?.id) ? (
    <AddToCartBtn
      disabled={disabled || outOfStock}
      variant={variant}
      onClick={handleAddClick}
    />
  ) : (
    <>
      <Counter
        value={getItemFromStock(item.id).quantity}
        onDecrement={handleRemoveClick}
        onIncrement={handleAddClick}
        variant={counterVariant || variant}
        className={counterClass}
        disabled={outOfStock}
      />
    </>
  );
};
