import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/cart/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/utils/cart-animation';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { generateCartItem } from '@/contexts/quick-cart/generate-cart-item';
import { number } from 'yup';
import { addItemToCartApi } from '../cartApi';

interface Props {data: any;variant?: 'helium' | 'neon' | 'argon' | 'oganesson' | 'single' | 'big';counterVariant?:| 'helium'| 'neon'| 'argon'| 'oganesson'| 'single'| 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
  id?:number;
  email?:string
}

interface CustomerData {
  customerId: number;
  email: string;
  phone: string;
  cartData: any;
  quantity:number
}

export const AddToCart = ({data,variant = 'helium',counterVariant,counterClass,variation,disabled, id, email}: Props) => {
  const {addItemToCart,removeItemFromCart,isInStock,getItemFromCart,isInCart,} = useCart();
  const item = generateCartItem(data, variation);

  const handleAddClick = ( e: React.MouseEvent<HTMLButtonElement | MouseEvent>) => {
        e.stopPropagation();
        const customerData: CustomerData = {
        customerId: id,
        email: email,
        phone: '8910412312',
        cartData: item
      };
     addItemToCart(customerData, 1, customerData.customerId, customerData.email, customerData.phone);

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
    <AddToCartBtn
      disabled={disabled || outOfStock}
      variant={variant}
      onClick={handleAddClick}
    />
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
