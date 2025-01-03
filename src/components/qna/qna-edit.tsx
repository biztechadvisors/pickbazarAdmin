// import Layout from '@/components/layouts/admin';
// import { useRouter } from 'next/router';
// import CreateOrUpdateTaxForm from '@/components/tax/tax-form';
// import ErrorMessage from '@/components/ui/error-message';
// import Loader from '@/components/ui/loader/loader';
// import { useTaxQuery } from '@/data/tax';
// import { GetStaticPaths } from 'next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';
// import CreateOrUpdateRegionsForm from '@/components/regions/region-form';
// import { useRegionsingleDataQuery } from '@/data/regions';
// import CreateOrUpdateQnaForm from './qna-form';
// import useQnaSingleDataQuery from '@/data/qna'


// export default function UpdateQnaPage() {
//   const { t } = useTranslation();
//   const { query } = useRouter();
//   console.log('query =',query)
//   const { data, isLoading: loading, error } = useQnaSingleDataQuery(query.id as string);
//   if (loading) return <Loader text={t('common:text-loading')} />;
//   if (error) return <ErrorMessage message={error.message} />;
//   console.log('data =',data)

//   return (
//     <>
//       <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
//         <h1 className="text-lg font-semibold text-heading">
//           Update FAQ #{data?.id}
//         </h1>
//       </div>
//       <CreateOrUpdateQnaForm initialValues={data} />
//     </>
//   );
// }
// UpdateQnaPage.Layout = Layout;

// export const getStaticProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
//   },
// });
// export const getStaticPaths: GetStaticPaths = async () => {
//   return { paths: [], fallback: 'blocking' };
// };
