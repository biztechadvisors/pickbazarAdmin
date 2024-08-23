import { useTranslation } from 'next-i18next';
import {
  billingAddressAtom,
  customerAtom,
  shippingAddressAtom,
} from '@/contexts/checkout';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Layout from '@/components/layouts/admin';
import { adminOnly } from '@/utils/auth-utils';
// import CustomerGrid from '@/components/checkout/customer/customer-grid';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery, useUserQuery } from '@/data/user';
import { AddressType } from '@/types';
import { PlusIcon } from '@/components/icons/plus-icon';
import AddCustomerSlider from './AddCustomerSlider';
import { checkoutCustAtom, shopIdAtom } from '@/utils/atoms';
import UserAddressSelection from '@/components/UserAddressSelection';
import PageLoader from '@/components/ui/page-loader/page-loader';

const CustomerEmail = dynamic(
  () => import('@/components/checkout/customer/CustomerEmail')
);

const ScheduleGrid = dynamic(
  () => import('@/components/checkout/schedule/schedule-grid')
);
const AddressGrid = dynamic(() => import('@/components/checkout/address-grid'));
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid')
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view')
);

export default function CheckoutPage() {
  const [shopId] = useAtom(shopIdAtom);
  const [customer] = useAtom(customerAtom);
  const { t } = useTranslation();

  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useUserQuery({ id: customer?.id });

  useEffect(() => {
    if (customer?.id) {
      refetch(customer?.id);
    }
  }, [customer?.id]);

  if (loading) {
    <div>
      <PageLoader />
    </div>;
  }

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="bg-gray-100">
      <div className="m-auto flex w-full max-w-5xl flex-col items-center lg:flex-row lg:items-start lg:space-s-8">
        <div className="w-full space-y-6 lg:max-w-2xl">
          <CustomerEmail count={1} />

          <ContactGrid
            className="shadow-700 bg-light p-5 md:p-8"
            contact={user?.contact}
            label={t('text-contact-number')}
            count={2}
          />

          <AddressGrid
            userId={user?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-billing-address')}
            count={3}
            addresses={user?.address?.filter(
              (address) => address?.type === AddressType.Billing
            )}
            atom={billingAddressAtom}
            type={AddressType.Billing}
          />

          <AddressGrid
            userId={user?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-shipping-address')}
            count={4}
            addresses={user?.address?.filter(
              (address) => address?.type === AddressType.Shipping
            )}
            atom={shippingAddressAtom}
            type={AddressType.Shipping}
          />

          <ScheduleGrid
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-delivery-schedule')}
            count={5}
          />
        </div>
        <div className="mb-10 mt-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
          <RightSideView />
        </div>
      </div>
    </div>
  );
}
CheckoutPage.authenticate = {
  permissions: adminOnly,
};
CheckoutPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
