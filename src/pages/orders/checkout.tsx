// import { useTranslation } from 'next-i18next';
// import {
//   billingAddressAtom,
//   customerAtom,
//   shippingAddressAtom,
// } from '@/contexts/checkout';
// import dynamic from 'next/dynamic';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { GetStaticProps } from 'next';
// import Layout from '@/components/layouts/admin';
// import { adminOnly } from '@/utils/auth-utils';
// import CustomerGrid from '@/components/checkout/customer/customer-grid';
// import { useEffect, useState } from 'react';
// import { useAtom } from 'jotai';
// import Loader from '@/components/ui/loader/loader';
// import { useUserQuery } from '@/data/user';
// import { AddressType } from '@/types';
// import { PlusIcon } from '@/components/icons/plus-icon';
// import AddCustomerSlider from './AddCustomerSlider';

// const ScheduleGrid = dynamic(
//   () => import('@/components/checkout/schedule/schedule-grid')
// );
// const AddressGrid = dynamic(() => import('@/components/checkout/address-grid'));
// const ContactGrid = dynamic(
//   () => import('@/components/checkout/contact/contact-grid')
// );
// const RightSideView = dynamic(
//   () => import('@/components/checkout/right-side-view')
// );

// export default function CheckoutPage() {
//   const [customer] = useAtom(customerAtom);
//   const { t } = useTranslation();

//   const [showAddCustomerSlider, setShowAddCustomerSlider] = useState(false);

//   const handleCloseAddCustomerSlider = () => {
//     setShowAddCustomerSlider(false);
//   };

//   const handleOpenAddCustomerSlider = () => {
//     setShowAddCustomerSlider(true);
//   };

//   const handleSubmitAddCustomerForm = (formData: {
//     email: string;
//     phone: string;
//   }) => {
//     // Handle form submission logic here
//     console.log('Submitted form data:', formData);
//     setShowAddCustomerSlider(false);
//   };

//   const {data: user,isLoading: loading,refetch,} = useUserQuery({ id: customer?.value });

//   useEffect(() => {
//     if (customer?.value) {
//       refetch(customer?.value);
//     }
//   }, [customer?.value]);

//   if (loading) return <Loader text={t('common:text-loading')} />;

//   console.log('users', user )
//   console.log('customer', customer)

//   return (
//     <div className="bg-gray-100">
//       <div className="m-auto flex w-full max-w-5xl flex-col items-center lg:flex-row lg:items-start lg:space-s-8">
//         <div className="w-full space-y-6 lg:max-w-2xl">
//           <div className="shadow-700 bg-light p-5 md:p-8">
//             <button
//               className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none "
//               onClick={handleOpenAddCustomerSlider}
//             >
//               Add Customer
//               <PlusIcon className="h-4 w-4 stroke-2 me-0.5" />
//             </button>
//             {showAddCustomerSlider && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
//                 <AddCustomerSlider
//                   onClose={handleCloseAddCustomerSlider}
//                   onSubmit={handleSubmitAddCustomerForm}
//                 />
//               </div>
//             )}
//           </div>

//           <CustomerGrid
//             className="shadow-700 bg-light p-5 md:p-8"
//             label={t('text-customer')}
//             count={1}
//           />
//           <ContactGrid
//             className="shadow-700 bg-light p-5 md:p-8"
//             //@ts-ignore
//             contact={user?.contact}
//             label={t('text-contact-number')}
//             count={1}
//           />


//           <AddressGrid
//             userId={user?.id!}
//             className="shadow-700 bg-light p-5 md:p-8"
//             label={t('text-billing-address')}
//             count={2}
//             //@ts-ignore
//             addresses={user?.address?.filter(
//               (address) => address?.type === AddressType.Billing
//             )}
//             //@ts-ignore
//             atom={billingAddressAtom}
//             type={AddressType.Billing}
//           />
//           <AddressGrid
//             userId={user?.id!}
//             className="shadow-700 bg-light p-5 md:p-8"
//             label={t('text-shipping-address')}
//             count={3}
//             //@ts-ignore
//             addresses={user?.address?.filter(
//               (address) => address?.type === AddressType.Shipping
//             )}
//             //@ts-ignore
//             atom={shippingAddressAtom}
//             type={AddressType.Shipping}
//           />
//           <ScheduleGrid
//             className="shadow-700 bg-light p-5 md:p-8"
//             label={t('text-delivery-schedule')}
//             count={4}
//           />
//         </div>
//         <div className="mb-10 mt-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
//           <RightSideView />
//         </div>
//       </div>
//     </div>
//   );
// }
// CheckoutPage.authenticate = {
//   permissions: adminOnly,
// };
// CheckoutPage.Layout = Layout;

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
//   },
// });


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
import { useUserQuery } from '@/data/user';
import { AddressType } from '@/types';
import { PlusIcon } from '@/components/icons/plus-icon';
import AddCustomerSlider from './AddCustomerSlider';
import { checkoutCustAtom } from '@/utils/atoms';

const CustomerEmail = dynamic(() => import('@/components/checkout/customer/customerEmail'))

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
  const [customer] = useAtom(customerAtom);
  const { t } = useTranslation();

  const { data: user, isLoading: loading, refetch, } = useUserQuery({ id: customer?.id });

  useEffect(() => {
    if (customer?.id) {
      refetch(customer?.id);
    }
  }, [customer?.id]);


  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <div className="bg-gray-100">
      <div className="m-auto flex w-full max-w-5xl flex-col items-center lg:flex-row lg:items-start lg:space-s-8">
        <div className="w-full space-y-6 lg:max-w-2xl">
          <CustomerEmail count={1} />

          {/* <CustomerGrid
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-customer')}
            count={1}
          /> */}
          <ContactGrid
            className="shadow-700 bg-light p-5 md:p-8"
            //@ts-ignore
            contact={user?.contact}
            label={t('text-contact-number')}
            count={2}
          />


          <AddressGrid
            userId={user?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-billing-address')}
            count={3}
            //@ts-ignore
            addresses={user?.address?.filter(
              (address) => address?.type === AddressType.Billing
            )}
            //@ts-ignore
            atom={billingAddressAtom}
            type={AddressType.Billing}
          />
          <AddressGrid
            userId={user?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-shipping-address')}
            count={4}
            //@ts-ignore
            addresses={user?.address?.filter(
              (address) => address?.type === AddressType.Shipping
            )}
            //@ts-ignore
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

