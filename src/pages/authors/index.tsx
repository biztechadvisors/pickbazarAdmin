import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import { LIMIT } from '@/utils/constants';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { GetStaticProps } from 'next';
import AuthorList from '@/components/author/author-list';
import { useAuthorsQuery } from '@/data/author';
import { SortOrder } from '@/types';
import { Config } from '@/config';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { siteSettings } from '@/settings/site.settings';

export default function Authors() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { authors, loading, paginatorInfo, error } = useAuthorsQuery({
    limit: LIMIT,
    name: searchTerm,
    page,
    orderBy,
    sortedBy,
    language: locale,
  });
  const [getPermission,_]=useAtom(newPermission)
  const { permissions } = getAuthCredentials();
  const canWrite =  permissions.includes('super_admin')
  ? siteSettings.sidebarLinks
  :getPermission?.find(
    (permission) => permission.type === 'sidebar-nav-item-authors'
  )?.write;

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:text-authors')}
          </h1>
        </div>

        <div className="ms-auto flex w-full flex-col items-center space-y-4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />

          {canWrite && locale === Config.defaultLanguage && (
            <LinkButton
              href={`${Routes.author.create}`}
              className="md:ms-6 h-12 w-full md:w-auto"
            >
              <span>+ {t('form:button-label-add-author')}</span>
            </LinkButton>
          )}
        </div>
      </Card>

      <AuthorList
        authors={authors}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
Authors.authenticate = {
  permissions: adminOnly,
};
Authors.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common', 'table'])),
  },
});
