import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { SortOrder } from '@/types';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo } from '@/types';
import ActionButtons from '../common/action-buttons';
import { Routes } from '@/config/routes';

export type IProps = {
  qna: any | undefined | null; // QnA data
  onPagination: (key: number) => void; // Pagination callback
  paginatorInfo: MappedPaginatorInfo | null; // Paginator information
};

const QnaList = ({ qna, onPagination, paginatorInfo }: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      setSortingObj((prev) => ({
        sort: prev.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      }));
    },
  });

  const tableData =
    qna?.map((item: any) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })) || [];

  // Table configuration
  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-question')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'question'
          }
          isActive={sortingObj.column === 'question'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'question',
      key: 'question',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('question'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-answer')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'answer'
          }
          isActive={sortingObj.column === 'answer'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'answer',
      key: 'answer',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('answer'),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`/qna/edit/${id}`} // Update the edit URL according to your routes
          // editUrl={`${Routes.faq.list}/editqna/${id}`}
          deleteModalView="DELETE_QNA"
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={tableData}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: (record: any) => record.children?.length,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.limit}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default QnaList;
