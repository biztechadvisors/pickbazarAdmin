import Card from '@/components/common/card';
import AdminLayout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TagList from '@/components/tag/tag-list';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { SortOrder } from '@/types';
import { Routes } from '@/config/routes';
import { useTagsQuery } from '@/data/tag';
import { useRouter } from 'next/router';
import { Config } from '@/config';

import { useMeQuery } from '@/data/user';
import { AllPermission } from '@/utils/AllPermission';

export default function Tags() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data: meData } = useMeQuery();
  const shopSlug = meData?.managed_shop?.slug;
  const {
    tags,
    loading: loading,
    paginatorInfo,
    error,
  } = useTagsQuery({
    limit: 10,
    orderBy,
    sortedBy,
    // name: searchTerm,
    page,
    language: locale,
    shopSlug,
    search:searchTerm,
  });
  const totalPages = Math.ceil((paginatorInfo?.total || 0) / (paginatorInfo?.perPage || 1));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [paginatorInfo?.total, paginatorInfo?.perPage, page]);

  // const [getPermission, _] = useAtom(newPermission);
  // const { permissions } = getAuthCredentials();
  // const canWrite = permissions?.includes('super_admin')
  //   ? siteSettings.sidebarLinks
  //   : getPermission?.find(
  //       (permission) => permission.type === 'sidebar-nav-item-tags'
  //     )?.write;

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-tags');

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-tags')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {canWrite && locale === Config.defaultLanguage && (
            <LinkButton
              href={`/${shopSlug}${Routes.tag.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-tag')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          )}
        </div>
      </Card>

      <TagList
        tags={tags}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        paginatorInfo={paginatorInfo}
      />
    </>
  );
}
Tags.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
Tags.Layout = AdminLayout;

// export const getStaticProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
//   },
// });

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
