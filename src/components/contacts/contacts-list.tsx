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
  contacts: any | undefined | null; // Change to match your data type
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  paginatorInfo: MappedPaginatorInfo | null;
};

const ContactsList = ({
  contacts,
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

  // Transforming contacts data for the table
  const tableData =
    contacts?.data?.map((contact) => ({
      id: contact.id,
      fullName: contact.fullName,
      phone: contact.phone,
      email: contact.email,
      location: contact.location || 'N/A', // Handle optional location
    })) || [];

  // Table configuration
  const columns = [
    {
      title: t('table:table-item-full-name'),
      dataIndex: 'fullName',
      key: 'fullName',
      align: alignLeft,
      onHeaderClick: onHeaderClick('fullName'),
    },
    {
      title: t('table:table-item-phone'),
      dataIndex: 'phone',
      key: 'phone',
      align: alignLeft,
      onHeaderClick: onHeaderClick('phone'),
    },
    {
      title: t('table:table-item-email'),
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
      onHeaderClick: onHeaderClick('email'),
    },
    {
      title: t('table:table-item-location'),
      dataIndex: 'location',
      key: 'location',
      align: alignLeft,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (id: string) => (
        <ActionButtons id={id} deleteModalView="DELETE_CONTACT" />
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
            // pageSize={paginatorInfo?.page}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default ContactsList;
