// import { useRouter } from 'next/router';
// import ErrorMessage from '@/components/ui/error-message';
// import Loader from '@/components/ui/loader/loader';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// import {
//   adminOnly,
//   adminOwnerAndStaffOnly,
//   getAuthCredentials,
//   hasAccess,
// } from '@/utils/auth-utils';
// import { useAttributeQuery } from '@/data/attributes';
// import { Config } from '@/config';
// import { Routes } from '@/config/routes';
// import { useMeQuery } from '@/data/user';
// import shop from '@/components/layouts/shop';
// import { useShopQuery } from '@/data/shop';
// import AdminLayout from '@/components/layouts/admin';
// import BlogCreateOrUpdateForm from '@/components/blog/blog-form';
// import { useEventSingleData } from '@/data/event';

// export default function UpdateBlogPage() {
//   const { t } = useTranslation();
//   const { query } = useRouter();

//   console.log("queryfor Blog", query)
//   const { data, isLoading: loading, error } = useEventSingleData(query.id as string);


//   console.log("dataForSingleEVENTID_____________________________", data)

//   if (loading) return <Loader text={t('common:text-loading')} />;
//   if (error) return <ErrorMessage message={error.message} />;

//   return (
//     <>
//       <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
//         <h1 className="text-lg font-semibold text-heading">
//           {t('form:edit-blog')}
//         </h1>
//       </div>
//       <BlogCreateOrUpdateForm initialValues={data} />
//     </>
//   );
// }
// UpdateBlogPage.authenticate = {
//   permissions: adminOwnerAndStaffOnly,
// };
// UpdateBlogPage.Layout = AdminLayout;
// export const getServerSideProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
//   },
// });


import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import AdminLayout from '@/components/layouts/admin';
// import BlogCreateOrUpdateForm from '@/components/blog/blog-form';
import EventCreateOrUpdate, { FormValues } from '@/components/event/event-form';
import { useEventSingleData } from '@/data/event';

export default function CreateAttributePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;
  const response = useEventSingleData(router.query.id);

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-event')}
        </h1>
      </div>
      <EventCreateOrUpdate initialValues={response.data as FormValues}/>
    </>
  );
}
CreateAttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
CreateAttributePage.Layout = AdminLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form'])),
  },
});

