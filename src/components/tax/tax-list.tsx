
import { AlignType, Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { MappedPaginatorInfo, SortOrder, Tax } from '@/types';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { AllPermission } from '@/utils/AllPermission';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  taxes: Tax[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
   onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const TaxList = ({ taxes, 
  paginatorInfo,
  onPagination,
   onSort, 
   onOrder }: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
 
  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-taxes');

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
      align: 'center' as AlignType,
      width: 62,
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
      align: alignLeft as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: (
        <TitleWithSort
          title={`${t('table:table-item-rate')} (%)`}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'rate'
          }
          isActive={sortingObj.column === 'rate'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center' as AlignType,
      onHeaderCell: () => onHeaderClick('rate'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-hsn_no')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'country'
          }
          isActive={sortingObj.column === 'hsn'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'hsn_no',
      key: 'hsn_no',
      align: 'center' as AlignType,
      onHeaderCell: () => onHeaderClick('hsn'),
    },
    {

      // title:`${t('table:table-item-cgst')} (%)
      title: `${t('table:table-item-cgst')} (%)`,
      dataIndex: 'cgst',
      key: 'cgst',
      align: 'center' as AlignType,
    },
    {
      title: `${t('table:table-item-sgst')} (%)`,
      dataIndex: 'sgst',
      key: 'sgst',
      align: 'center' as AlignType,
    },
    {
      title: t('table:table-item-gst_Name'),
      dataIndex: 'gst_Name',
      key: 'gst_Name',
      align: 'center' as AlignType,
    },
    // {
    //   title: t('table:table-item-compensatoin'),
    //   dataIndex: 'compensatoin_cess',
    //   key: 'compensatoin_cess',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: t('table:table-item-sac_no'),
    //   dataIndex: 'sac_no',
    //   key: 'sac_no',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-country')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'country'
    //       }
    //       isActive={sortingObj.column === 'country'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'country',
    //   key: 'country',
    //   align: 'center' as AlignType,
    //   onHeaderCell: () => onHeaderClick('country'),
    // },
    // {
    //   title: t('table:table-item-city'),
    //   dataIndex: 'city',
    //   key: 'city',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: t('table:table-item-state'),
    //   dataIndex: 'state',
    //   key: 'state',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: t('table:table-item-zip'),
    //   dataIndex: 'zip',
    //   key: 'zip',
    //   align: 'center' as AlignType,
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right' as AlignType,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.tax.list}/edit/${id}`}
          deleteModalView="DELETE_TAX"
        />
      ),
      width: 200,
    },
  ];
  return (
    <>
    <div className="mb-8 overflow-hidden rounded shadow">
      {/* @ts-ignore */}
      <Table
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={taxes?.items || []}
        rowKey="id"
        scroll={{ x: 900 }}
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

export default TaxList;
