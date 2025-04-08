import AdminLayout from '@/components/layouts/admin';
import Layout from '@/components/layouts/admin';
import OwnerLayout from '@/components/layouts/owner';
import Loader from '@/components/ui/loader/loader';
import CustomerCreateForm from '@/components/user/user-form';
import { useUserQuery } from '@/data/user';
import { getAuthCredentials } from '@/utils/auth-utils';
import { OWNER } from '@/utils/constants';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function CreateCustomerPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  
  const { data: userData, isLoading: userLoading } = useUserQuery(
    { id: id as string },
    { enabled: !!id }
  );

  if (userLoading) return <Loader />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
        {id ? t('form:form-title-edit-customer') : t('form:form-title-create-customer')}
        </h1>
      </div>
      <CustomerCreateForm initialValues={userData}/>
    </>
  );
}
// CreateCustomerPage.Layout = OwnerLayout;
CreateCustomerPage.Layout =
  getAuthCredentials().permissions?.[0] === OWNER ? OwnerLayout : AdminLayout;
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
