import dynamic from 'next/dynamic';

const VerifiedItemList = dynamic(
  () => import('@/components/checkout/item/verified-item-list')
);

export const RightSideView = () => {
  return <VerifiedItemList />;
};

export default RightSideView;
