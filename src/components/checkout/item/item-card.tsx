import ToggleButton from '@/components/toggling/ToggleMargin';
import { useMeQuery } from '@/data/user';
import usePrice from '@/utils/use-price';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface Props {
  item: any;
  margin?: number; // Added margin as an optional prop
  notAvailable?: boolean;
}

const ItemCard = ({ item, margin, notAvailable }: Props) => {
  const { t } = useTranslation('common');
  const { price } = usePrice({
    amount: item.itemTotal,
  });

  const { data } = useMeQuery();

  let dealerId;
  if (data?.dealer?.id && data?.permission?.permission?.type_name === "Dealer") {
    dealerId = data?.dealer?.id;
  }


  return (
    <div className={cn('flex items-center justify-between py-4 border-b border-gray-200')} key={item.id}>
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 relative">
        <Image
          src={item.image || '/placeholder-product-image.png'} // Fallback image if item.image is missing
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="text-sm font-semibold text-heading">{item.name}</h3>
        <p className="text-sm text-body mt-1">
          <span className="font-bold">{item.quantity}</span>
          <span className="mx-1">x</span>
          <span>{item.price}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">{item.unit}</p>
      </div>

      {/* Toggle Button for Dealers */}
      {dealerId && (
        <div className="ml-4">
          <ToggleButton margin={margin} />
        </div>
      )}

      {/* Total Price */}
      <div className="ml-4">
        <span className={cn('text-sm font-semibold', notAvailable ? 'text-red-500' : 'text-heading')}>
          {!notAvailable ? price : t('text-unavailable')}
        </span>
      </div>
    </div>
  );
};

export default ItemCard;