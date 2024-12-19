import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { AllPermission } from '@/utils/AllPermission';
import { useFaqQuery } from '@/data/faq';
import { useMeQuery } from '@/data/user';
import FaqList from '@/components/faq/faq-list';
import { useQnaQuery } from '@/data/qna';
import QnaList from '@/components/qna/qna-list'; // Import the QnaList component

export default function Faq() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data: me } = useMeQuery();

  const shopSlug = me?.managed_shop?.slug;

  const { faq, loading, paginatorInfo, error } = useFaqQuery({
    shopSlug,
    orderBy,
    sortedBy,
    language:locale,
    code: me?.managed_shop?.slug,
    search:searchTerm,
    page,
    limit: 10,
  });

  const faqId = faq?.data?.[0]?.id;

  const {
    qna,
    loading: qnaLoading,
    error: qnaError,
    paginatorInfo: qnaPaginatorInfo, // Assuming you handle pagination here
  } = useQnaQuery({
    orderBy,
    sortedBy,
    language:locale,
    search:searchTerm,
    page,
    faqId,
    limit: 10,
  });

  const totalPages = Math.ceil((paginatorInfo?.total || 0) / (paginatorInfo?.perPage || 1));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [paginatorInfo?.total, paginatorInfo?.perPage, page]);

  console.log("qnaPage", qna,qnaPaginatorInfo);

  const { permissions } = getAuthCredentials();
  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-faq');

  if (loading || qnaLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  if (qnaError) return <ErrorMessage message={qnaError.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-4 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-faq')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />
          <LinkButton
            href="/faq/create"
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span>+ {t('form:button-label-add-faq')}</span>
          </LinkButton>
        </div>
      </Card>

      <FaqList
        faq={faq}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />

      <Card className="mb-4 mt-11 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-qna')} {/* Change the label accordingly */}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />
          <LinkButton
            href="/qna/create" // Adjust the URL to match your routing
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span>+ {t('form:button-label-add-qna')}</span>{' '}
            {/* Change the button label accordingly */}
          </LinkButton>
        </div>
      </Card>
      {/* Add the QnA List below the FAQ List */}
      <Card className="mb-8">
        {/* <h2 className="mb-4 text-xl font-semibold text-heading">
          {t('form:input-label-qna')}
        </h2> */}
        <QnaList
          qna={qna} // Pass the QnA data
          paginatorInfo={qnaPaginatorInfo} // Pass the paginator info
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn} // Assuming you have pagination handling
        />
      </Card>
    </>
  );
}

Faq.authenticate = {
  permissions: adminOnly,
};

Faq.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
