import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/products/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/lib/cart-animation';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { generateCartItem } from '@/contexts/quick-cart/generate-cart-item';


interface Props {
  data: any;
  variant?:
  | 'helium'
  | 'neon'
  | 'argon'
  | 'oganesson'
  | 'single'
  | 'big'
  | 'text';
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
}

export const AddToCart = ({
  data,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
    // updateCartLanguage,
    // language,
  } = useCart();
  
  const item = generateCartItem(data, variation);
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    // Check language and update
    // if (item?.language !== language) {
    //   updateCartLanguage(item?.language);
    // }
    addItemToCart(item, 1);
    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
  };
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };
  const outOfStock = isInCart(item?.id) && !isInStock(item.id);
  return !isInCart(item?.id) ? (
    <div>
      <AddToCartBtn
        disabled={
          disabled || outOfStock || data.status.toLowerCase() != 'publish'
        }
        variant={variant}
        onClick={handleAddClick}
      />
    </div>
  ) : (
    <>
      <Counter
        value={getItemFromCart(item.id).quantity}
        onDecrement={handleRemoveClick}
        onIncrement={handleAddClick}
        variant={counterVariant || variant}
        className={counterClass}
        disabled={outOfStock}
      />
    </>
  );
};
