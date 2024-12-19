import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { SortOrder } from '@/types';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo } from '@/types';
import { AllPermission } from '@/utils/AllPermission';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  careers: any | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  paginatorInfo: MappedPaginatorInfo | null;
};

const CareersList = ({
  careers,
  onPagination,
  onSort,
  onOrder,
  paginatorInfo,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;

  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-careers'); // Adjust permissions for careers

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
    careers?.data?.map((item) => ({
      id: item.id,
      fullName: item.fullName, // Added fullName
      phone: item.phone, // Added phone
      email: item.email, // Added email
      position: item.position, // Added position
      location: item.location, // Assuming careers have a location field
      cv_resume: item.cv_resume, // Added cv_resume
      vacancy: item.vacancy, // Added vacancy
      posted_at: item.posted_at, // Assuming posted date exists for careers
    })) || [];

  // Table configuration
  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-full-name')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'fullName'
          }
          isActive={sortingObj.column === 'fullName'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'fullName',
      key: 'fullName',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('fullName'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-phone')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'phone'
          }
          isActive={sortingObj.column === 'phone'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'phone',
      key: 'phone',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('phone'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-email')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'email'
          }
          isActive={sortingObj.column === 'email'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('email'),
      width: 200,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-position')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'position'
          }
          isActive={sortingObj.column === 'position'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'position',
      key: 'position',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('position'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-location')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'location'
          }
          isActive={sortingObj.column === 'location'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'location',
      key: 'location',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('location'),
    },
    {
      title: t('table:table-item-cv-resume'), // New column for CV Resume
      dataIndex: 'cv_resume',
      key: 'cv_resume',
      align: alignLeft,
    },
    {
      title: t('table:table-item-vacancy'), // New column for Vacancy
      dataIndex: 'vacancy',
      key: 'vacancy',
      align: alignLeft,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (id: string) => (
        <ActionButtons
          id={id} // Update route for careers
          deleteModalView="DELETE_CAREER" // Adjust the modal action for careers deletion
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

export default CareersList;
