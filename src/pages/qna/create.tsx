// import CreateOrUpdateQnaForm from '@/components/qna/qna-form'; // Import your QnA form component
// import Layout from '@/components/layouts/admin';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useRouter } from 'next/router';
// import { useFaqQuery } from '@/data/faq';
// import { useMeQuery } from '@/data/user';

// export default function CreateQnaPage() {
//   const { t } = useTranslation();
//   //   const router = useRouter();
//   //   const { faqId } = router.query;

//   const { data: me } = useMeQuery();
//   const { faq, loading, paginatorInfo, error } = useFaqQuery({
//     code: me?.managed_shop?.slug,
//   });

//   const faqId = faq?.data?.[0]?.id;
//   const faqIdNumber = Number(faqId);
//   console.log('faqId in CreateQnaPage:', faqId);

//   return (
//     <>
//       <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
//         <h1 className="text-lg font-semibold text-heading">
//           {t('form:form-title-create-qna')}{' '}
//           {/* Adjust the translation key for QnA */}
//         </h1>
//       </div>
//       <CreateOrUpdateQnaForm faqId={faqIdNumber} /> {/* Render the QnA form */}
//     </>
//   );
// }

// CreateQnaPage.Layout = Layout;

// // Server-side translations
// export const getStaticProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
//   },
// });
