import { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Attribute, MappedPaginatorInfo, Shop, SortOrder } from '@/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { AllPermission } from '@/utils/AllPermission';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  attributes: Attribute[] | undefined;
   paginatorInfo: MappedPaginatorInfo | null;
   onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const AttributeList = ({ 
  attributes,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const rowExpandable = (record: any) => record.children?.length;
  // const { alignLeft, alignRight } = useIsRTL();

  const alignLeft =
    router.locale === 'ar' || router.locale === 'he' ? 'right' : 'left';
  const alignRight =
    router.locale === 'ar' || router.locale === 'he' ? 'left' : 'right';

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const permissionTypes = AllPermission();

  const canWrite = permissionTypes.includes('sidebar-nav-item-attributes');

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

  let columns = [
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
      title: t('table:table-item-shop'),
      dataIndex: 'shop',
      key: 'shop',
      width: 180,
      align: 'center',
      ellipsis: true,
      render: (shop: Shop) => (
        <span className="truncate whitespace-nowrap">{shop?.name}</span>
      ),
    },
    {
      title: t('table:table-item-values'),
      dataIndex: 'values',
      key: 'values',
      align: alignLeft,
      render: (values: any) => {
        return (
          <span className="whitespace-nowrap">
            {values?.map((singleValue: any, index: number) => {
              return index > 0
                ? `, ${singleValue.value}`
                : `${singleValue.value}`;
            })}
          </span>
        );
      },
    },
    {
      ...(canWrite
        ? {
            title: t('table:table-item-actions'),
            dataIndex: 'slug',
            key: 'actions',
            align: alignRight,
            render: (slug: string, record: Attribute) => (
              <LanguageSwitcher
                slug={slug}
                record={record}
                deleteModalView="DELETE_ATTRIBUTE"
                routes={Routes?.attribute}
              />
            ),
          }
        : {}),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

  return (
    <>
    <div className="mb-8 overflow-hidden rounded shadow">
      <Table
        // @ts-ignore
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={attributes?.items || []}
        rowKey="id"
        scroll={{ x: 380 }}
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

export default AttributeList;
