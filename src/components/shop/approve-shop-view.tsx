// // import { Form } from '@/components/ui/form/form';
// // import Button from '@/components/ui/button';
// // import {
// //   useModalAction,
// //   useModalState,
// // } from '@/components/ui/modal/modal.context';
// // import Input from '@/components/ui/input';
// // import { useTranslation } from 'next-i18next';
// // import { useApproveShopMutation } from '@/data/shop';
 
// // type FormValues = {
// //   admin_commission_rate: number;
// // };
 
// // const ApproveShopView = () => {
// //   const { t } = useTranslation();
// //   const { mutate: approveShopMutation, isLoading: loading } =
// //     useApproveShopMutation();
 
// //   const { data: shopId } = useModalState();
// //   const { closeModal } = useModalAction();
 
// //   function onSubmit({ admin_commission_rate }: FormValues) {
// //     approveShopMutation({
// //       id: shopId as string,
// //       admin_commission_rate: Number(admin_commission_rate),
// //     });
// //     closeModal();
// //   }
 
// //   return (
// //     <Form<FormValues> onSubmit={onSubmit}>
// //       {({ register, formState: { errors } }) => (
// //         <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
// //           <Input
// //             label={t('form:input-label-admin-commission-rate')}
// //             {...register('admin_commission_rate', {
// //               required: 'You must need to set your commission rate',
// //             })}
// //             defaultValue="10"
// //             variant="outline"
// //             className="mb-4"
// //             error={t(errors.admin_commission_rate?.message!)}
// //           />
// //           <Button
// //             type="submit"
// //             loading={loading}
// //             disabled={loading}
// //             className="ms-auto"
// //           >
// //             {t('form:button-label-submit')}
// //           </Button>
// //         </div>
// //       )}
// //     </Form>
// //   );
// // };
 
// // export default ApproveShopView;
//  import Button from '@/components/ui/button';
// import {
//   useModalAction,
//   useModalState,
// } from '@/components/ui/modal/modal.context';
// import { useTranslation } from 'next-i18next';
// import { useApproveShopMutation } from '@/data/shop';
// import cn from 'classnames';
// import { useEffect } from 'react';

// const ApproveShopView = () => {
//   const { t } = useTranslation();
//   const { mutate: approveShopMutation, isLoading: loading } =
//     useApproveShopMutation();
//   const { data: shopId } = useModalState();
//   const { closeModal } = useModalAction();

//   // Effect to handle shop approval
//   useEffect(() => {
//     if (shopId) {
//       approveShopMutation({
//         id: shopId as string,
//       }).then(() => {
//         console.log('Shop approved successfully:', shopId);
//         // Optionally, you can trigger any further actions upon approval
//       }).catch((error) => {
//         console.error('Failed to approve shop:', error);
//         // Handle error scenarios if needed
//       });
//     }
//   }, [shopId, approveShopMutation]);

//   const handleApprove = () => {
//     closeModal();
//     // Shop approval will be handled in useEffect
//   };

//   return (
//     <div className="m-auto w-full max-w-sm rounded-md bg-light p-4 pb-6 sm:w-[24rem] md:rounded-xl">
//       <div className="h-full w-full text-center">
//         <div className="flex h-full flex-col justify-between">
//           <p className="mt-4 text-xl font-bold text-heading">You want to activate your shop?</p>
//           <div className="space-s-4 mt-8 flex w-full items-center justify-between">
//             <div className="w-1/2">
//               <Button
//                 onClick={closeModal}
//                 className={cn(
//                   'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
//                 )}
//               >
//                 {t('common:button-cancel')}
//               </Button>
//             </div>

//             <div className="w-1/2">
//               <Button
//                 onClick={handleApprove}
//                 loading={loading}
//                 disabled={loading}
//                 className={cn(
//                   'w-full rounded bg-accent py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-accent-hover focus:bg-accent-hover focus:outline-none'
//                 )}
//               >
//                 Activate
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproveShopView;


import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { useApproveShopMutation } from '@/data/shop';
import cn from 'classnames';
 
const ApproveShopView = () => {
  const { t } = useTranslation();
  const { mutate: approveShopMutation, isLoading: loading } =
    useApproveShopMutation();  
 
  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction();
 
  const handleApprove = () => {
    approveShopMutation({
      id: shopId as string,
    });
    closeModal();
  };
 
  return (
    <div className="m-auto w-full max-w-sm rounded-md bg-light p-4 pb-6 sm:w-[24rem] md:rounded-xl">
      <div className="h-full w-full text-center">
        <div className="flex h-full flex-col justify-between">
          <p className="mt-4 text-xl font-bold text-heading">You want to active your shop?</p>
          <div className="space-s-4 mt-8 flex w-full items-center justify-between">
            <div className="w-1/2">
              <Button
                onClick={closeModal}
                className={cn(
                  'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
                )}
              >
                {t('common:button-cancel')}
              </Button>
            </div>
 
            <div className="w-1/2">
              <Button
                onClick={handleApprove}
                loading={loading}
                disabled={loading}
                className={cn(
                  'w-full rounded bg-accent py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-accent-hover focus:bg-accent-hover focus:outline-none'
                )}
              >
                Active
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ApproveShopView;