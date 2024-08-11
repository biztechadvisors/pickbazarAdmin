import BlogList from '@/components/blog/bloglist';
import Card from '@/components/common/card';
import AdminLayout from '@/components/layouts/admin';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Blogs = () => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { data: meData } = useMeQuery();

  const shop: string | undefined = meData?.managed_shop?.id;
  const shopSlug = meData?.managed_shop?.slug;
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-blog')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/4">
            <LinkButton
              href={`/${shopSlug}${Routes.blog.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-blog')}
              </span>
            </LinkButton>
          </div>
        </div>
      </Card>
      <BlogList />
    </>
  );
};

Blogs.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

Blogs.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default Blogs;
