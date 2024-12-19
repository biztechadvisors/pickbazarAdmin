// // import Input from '@/components/ui/input';
// // import { useForm } from 'react-hook-form';
// // import Button from '@/components/ui/button';
// // import Description from '@/components/ui/description';
// // import Card from '@/components/common/card';
// // import { useRouter } from 'next/router';
// // import { Qna } from '@/types';
// // import { useTranslation } from 'next-i18next';
// // import { useMeQuery } from '@/data/user';
// // import { useCreateQnaMutation, useUpdateQnaMutation } from '@/data/qna';
// // import { useQnaSingleDataQuery } from '@/data/qna'; // Hook for fetching single QnA
// // import { useEffect } from 'react';

// // type IProps = {
// //   faqId: number;
// //   qnaId?: number; // Optional, for updating QnA
// // };

// // export default function CreateOrUpdateQnaForm({ faqId, qnaId }: IProps) {
// //   const router = useRouter();
// //   const { t } = useTranslation();
// //   const { data: me } = useMeQuery();

// //   // Fetch QnA data when qnaId is present
// //   const { data: fetchedQna, isLoading: fetchingQna } = useQnaSingleDataQuery(
// //     qnaId!,
// //     {
// //       enabled: !!qnaId, // Fetch only if qnaId exists
// //     }
// //   );

// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     formState: { errors },
// //   } = useForm<Qna>({
// //     shouldUnregister: true,
// //     defaultValues: fetchedQna ?? { question: '', answer: '' }, // Default form values
// //   });

// //   // Reset form when QnA data is fetched
// //   useEffect(() => {
// //     if (fetchedQna) {
// //       reset(fetchedQna); // Populate the form with fetched QnA
// //     }
// //   }, [fetchedQna, reset]);

// //   const { mutate: createQna, isLoading: creating } = useCreateQnaMutation();
// //   const { mutate: updateQna, isLoading: updating } = useUpdateQnaMutation();

// //   const onSubmit = async (values: Qna) => {
// //     if (qnaId) {
// //       // Update QnA
// //       updateQna({
// //         id: qnaId,
// //         ...values,
// //       });
// //     } else {
// //       // Create new QnA
// //       createQna({ ...values, faqId });
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(onSubmit)}>
// //       <div className="my-5 flex flex-wrap sm:my-8">
// //         <Description
// //           title={t('form:form-title-qna')}
// //           className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
// //         />
// //         <Card className="w-full sm:w-8/12 md:w-2/3">
// //           <Input
// //             label={t('form:input-label-question')}
// //             {...register('question')}
// //             error={t(errors.question?.message!)}
// //             variant="outline"
// //             className="mb-5"
// //           />
// //           <Input
// //             label={t('form:input-label-answer')}
// //             {...register('answer')}
// //             error={t(errors.answer?.message!)}
// //             variant="outline"
// //             className="mb-5"
// //           />
// //         </Card>
// //       </div>

// //       <div className="mb-4 text-end">
// //         <Button
// //           variant="outline"
// //           onClick={router.back}
// //           className="me-4"
// //           type="button"
// //         >
// //           {t('form:button-label-back')}
// //         </Button>
// //         <Button loading={creating || updating || fetchingQna}>
// //           {qnaId ? t('form:button-label-update') : t('form:button-label-add')}{' '}
// //           {t('form:form-title-qna')}
// //         </Button>
// //       </div>
// //     </form>
// //   );
// // }



// import Input from '@/components/ui/input';
// import { useForm } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import { useRouter } from 'next/router';
// import { Qna } from '@/types';
// import { useTranslation } from 'next-i18next';
// import { useMeQuery } from '@/data/user';
// import { useCreateQnaMutation, useUpdateQnaMutation } from '@/data/qna';
// import { useQnaSingleDataQuery } from '@/data/qna'; // Hook for fetching single QnA
// import { useEffect } from 'react';

// type IProps = {
//   faqId: number;
//   qnaId?: number; // Optional, for updating QnA
// };

// export default function CreateOrUpdateQnaForm({ faqId, qnaId }: IProps) {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { data: me } = useMeQuery();

//   // Fetch QnA data when qnaId is present
//   // const { data: fetchedQna, isLoading: fetchingQna } = useQnaSingleDataQuery(
//   //   qnaId?.toString() || '', // Avoid using qnaId! and ensure string type
//   //   {
//   //     enabled: !!qnaId, // Fetch only if qnaId exists
//   //   }
//   // );

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<Qna>({
//     shouldUnregister: true,
//     defaultValues: fetchedQna || { question: '', answer: '' }, // Ensure default values are provided
//   });

//   // Reset form when QnA data is fetched
//   useEffect(() => {
//     if (fetchedQna) {
//       reset(fetchedQna); // Populate the form with fetched QnA
//     }
//   }, [fetchedQna, reset]);

//   const { mutate: createQna, isLoading: creating } = useCreateQnaMutation();
//   const { mutate: updateQna, isLoading: updating } = useUpdateQnaMutation();

//   const onSubmit = async (values: Qna) => {
//     if (qnaId) {
//       // Update QnA
//       updateQna({
//         id: qnaId,
//         ...values,
//       });
//     } else {
//       // Create new QnA
//       createQna({ ...values, faqId });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="my-5 flex flex-wrap sm:my-8">
//         <Description
//           title={t('form:form-title-qna')}
//           className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//         />
//         <Card className="w-full sm:w-8/12 md:w-2/3">
//           <Input
//             label={t('form:input-label-question')}
//             {...register('question', { required: 'Question is required' })}
//             error={t(errors.question?.message!)}
//             variant="outline"
//             className="mb-5"
//           />
//           <Input
//             label={t('form:input-label-answer')}
//             {...register('answer', { required: 'Answer is required' })}
//             error={t(errors.answer?.message!)}
//             variant="outline"
//             className="mb-5"
//           />
//         </Card>
//       </div>

//       <div className="mb-4 text-end">
//         <Button
//           variant="outline"
//           onClick={router.back}
//           className="me-4"
//           type="button"
//         >
//           {t('form:button-label-back')}
//         </Button>
//         <Button loading={creating || updating || fetchingQna}>
//           {qnaId ? t('form:button-label-update') : t('form:button-label-add')}{' '}
//           {t('form:form-title-qna')}
//         </Button>
//       </div>
//     </form>
//   );
// }


import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Qna, QnaFormValues } from '@/types';
import { useTranslation } from 'next-i18next';
import { useCreateQnaMutation, useUpdateQnaMutation } from '@/data/qna';
import { useEffect } from 'react';


// type IProps = {
//   faqId: number;
//   qnaId?: number; // Optional, for updating QnA
//   initialValues?: QnaFormValues; // For pre-filled data in case of editing
// };
interface IProps {
  faqId: number;
  qnaId?: number;
  initialValues?: QnaFormValues;
}
export default function CreateOrUpdateQnaForm({ faqId, qnaId, initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QnaFormValues>({
    defaultValues: initialValues || { question: '', answer: '' }, // Initialize with empty or fetched data
  });

  const { mutate: createQna, isLoading: creating } = useCreateQnaMutation();
  const { mutate: updateQna, isLoading: updating } = useUpdateQnaMutation();

  // Populate the form when initialValues are present (for editing)
  useEffect(() => {
    if (initialValues) {
      reset(initialValues); // Reset form to reflect the existing QnA data
    }
  }, [initialValues, reset]);

  const onSubmit = async (values: Qna) => {
    if (qnaId) {
      updateQna({ id: qnaId, ...values });
    } else {
      createQna({ ...values, faqId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-qna')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-question')}
            {...register('question', { required: 'Question is required' })}
            error={t(errors.question?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-answer')}
            {...register('answer', { required: 'Answer is required' })}
            error={t(errors.answer?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>
        <Button loading={creating || updating}>
          {qnaId ? t('form:button-label-update') : t('form:button-label-add')}{' '}
          {t('form:form-title-qna')}
        </Button>
      </div>
    </form>
  );
}
