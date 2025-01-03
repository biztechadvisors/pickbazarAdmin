import { SortOrder } from '@/types';
import { AllPermission } from '@/utils/AllPermission';
import { useIsRTL } from '@/utils/locals';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'rc-table';
import Pagination from '@/components/ui/pagination';
import LanguageSwitcher from '../ui/lang-action/action';
import { Routes } from '@/config/routes';
import ActionButtons from '../common/action-buttons';
import TitleWithSort from '../ui/title-with-sort';

const BlogList = ({
  blogs,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();
 
  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-categories');

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 60,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: t('table:table-item-content'),
      dataIndex: 'title',
    },
    {
      title: t('table:table-item-image'),
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 180,
    },
    {
      ...(canWrite
        ? {
            title: t('table:table-item-actions'),
            dataIndex: 'id',
            key: 'actions',
            align: 'right',
            render: (id: string) => (
              <ActionButtons
                id={id}
                editUrl={`${Routes.blog.list}/edit/${id}`}
                deleteModalView="DELETE_BLOG"
              />
            ),
          }
        : {}),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={blogs}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => ' ',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
      <div className="flex items-center justify-end">
        <Pagination
          total={paginatorInfo.total}
          current={paginatorInfo.currentPage}
          // pageSize={paginatorInfo.perPage}
          onChange={onPagination}
        />
      </div>
    )}
    </>
  );
};

export default BlogList;
