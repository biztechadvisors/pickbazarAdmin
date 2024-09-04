import BlogList from '@/components/blog/bloglist';
import TypeFilter from '@/components/category/type-filter';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import AdminLayout from '@/components/layouts/admin';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import { useBlogsQuery } from '@/data/blog';
import { useMeQuery } from '@/data/user';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Blogs = () => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { data: meData } = useMeQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const shop: string | undefined = meData?.managed_shop?.id;
  const shopSlug = meData?.managed_shop?.slug;

  const { data, isLoading, error } = useBlogsQuery(shopSlug);

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  console.log("shopSlug", shopSlug)
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-blog')}
            </h1>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search onSearch={handleSearch} />

            <TypeFilter className="md:ms-6" />

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
