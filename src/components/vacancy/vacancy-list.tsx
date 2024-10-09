import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { SortOrder } from '@/types';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import ActionButtons from '../common/action-buttons';
import { AllPermission } from '@/utils/AllPermission';

export type IProps = {
  vacancies: any | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  vacancyPaginatorInfo: MappedPaginatorInfo | null;
};

const VacancyList = ({
  vacancies,
  onPagination,
  onSort,
  onOrder,
  vacancyPaginatorInfo,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-tags');
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

  const tableData =
    vacancies?.data?.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      employmentType: item.employmentType,
      salaryRange: item.salaryRange,
      // Assuming `location` is an object and we want the title
      location: item.location ? item.location.title : null, // Update here
    })) || [];

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'title'
          }
          isActive={sortingObj.column === 'title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('title'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-description')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'description'
          }
          isActive={sortingObj.column === 'description'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'description',
      key: 'description',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('description'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-employment-type')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'employmentType'
          }
          isActive={sortingObj.column === 'employmentType'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'employmentType',
      key: 'employmentType',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('employmentType'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-salary-range')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'salaryRange'
          }
          isActive={sortingObj.column === 'salaryRange'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'salaryRange',
      key: 'salaryRange',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('salaryRange'),
    },
    {
      title: t('table:table-item-locations'), // New Column Title
      dataIndex: 'location', // Data index for location
      key: 'location', // Key for the location column
      align: alignLeft,
      render: (location: any) => (
        <span>{location ? location : t('table:no-locations')}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.vacancies.list}/edit/${id}`} // Adjusted for vacancies
          deleteModalView="DELETE_VACANCY" // Adjusted for vacancies
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

      {!!vacancyPaginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={vacancyPaginatorInfo?.total}
            current={vacancyPaginatorInfo?.currentPage}
            pageSize={vacancyPaginatorInfo?.page}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default VacancyList;
