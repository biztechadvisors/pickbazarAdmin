import { verifiedResponseAtom } from '@/contexts/checkout';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

const UnverifiedItemListStock = dynamic(
  () => import('@/components/checkout/item/unverifiedItemListStock')
);
const VerifiedItemListStock = dynamic(
  () => import('@/components/checkout/item/verified-item-list-stock')
);

export const RightSideViewStock = () => {
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  if (isEmpty(verifiedResponse)) {
    return <UnverifiedItemListStock />;
  }
  return <VerifiedItemListStock />;
};

export default RightSideViewStock;
