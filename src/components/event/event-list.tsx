import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Category, MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { AllPermission } from '@/utils/AllPermission';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  events: Event[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const EventLists = ({ 
  events,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {

  console.log("eventseventsevents", events)
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

  // const onHeaderClick = (column: string | null) => ({
  //   onClick: () => {
  //     onSort((currentSortDirection: SortOrder) =>
  //       currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
  //     );
  //     onOrder(column!);

  //     setSortingObj({
  //       sort:
  //         sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
  //       column: column,
  //     });
  //   },
  // });

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
          title={t('table:table-item-titles')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
      width: 150,
      // onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: t('table:table-item-event-name'),
      dataIndex: 'eventName',
      key: 'eventName',
      ellipsis: true,
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-desc'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-image'),
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 180,

      render: (image: any, { name }: { name: string }) => {
        if (!image?.thumbnail) return null;

        return (
          <div className="relative mx-auto h-10 w-10">
            <Image
              src={image?.thumbnail ?? '/'}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw"
              className="overflow-hidden rounded object-fill"
            />
          </div>
        );
      },
    },
    {
      title: t('table:table-item-location'),
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
      align: alignLeft,
      width: 200,
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
                // editUrl={`${Routes.event.list}/edit/${id}`}
                editUrl={`${Routes.event.list}/edit/${id}`}
                deleteModalView="DELETE_EVENT"
              />
            ),
          }
        : null),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={events}
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
            pageSize={paginatorInfo.perPage || 10}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default EventLists;
