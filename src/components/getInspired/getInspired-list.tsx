import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { SortOrder } from '@/types';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  getInspired: any | undefined | null; // Change to match your data type
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  paginatorInfo: MappedPaginatorInfo | null;
};

const GetInspiredList = ({
  getInspired,
  onPagination,
  onSort,
  onOrder,
  paginatorInfo,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;

  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => () => {
    onSort((currentSortDirection: SortOrder) =>
      currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
    );
    onOrder(column!);

    setSortingObj({
      sort: sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
      column: column,
    });
  };

  // Transforming getInspired data to include images and tags
  const tableData =
    getInspired?.data?.map((item) => ({
      id: item.id,  
      images: item.images.map((image) => (
        <img
          key={image.id}
          src={image.thumbnail} // Display the thumbnail
          alt={item.title}
          className="h-12 w-12 object-cover"
        />
      )),
      tags: item.tags.map((tag) => tag.name).join(', '), 
      title: item.title,  
      type: item.type,  
       
    })) || [];

  // Table configuration
  const columns = [
    {
      title: t('table:table-item-images'),
      dataIndex: 'images',
      key: 'images',
      align: alignLeft,
      render: (images: React.ReactNode) => (
        <div className="flex space-x-2">{images}</div>
      ),
    },
    {
      title: t('table:table-item-title'),
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
    },
    {
      title: t('table:table-item-type'),
      dataIndex: 'type',
      key: 'type',
      align: alignLeft,
    },
    {
      title: t('table:table-item-tags'),
      dataIndex: 'tags',
      key: 'tags',
      align: alignLeft,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.getInspired.list}/edit/${id}`} // Adjust URL as needed
          deleteModalView="DELETE_GET_INSPIRED"
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={tableData}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default GetInspiredList;
