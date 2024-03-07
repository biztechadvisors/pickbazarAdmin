import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import Badge from '@/components/ui/badge/badge';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  Product,
  MappedPaginatorInfo,
  ProductType,
  Shop,
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { newPermission, permissionAtom } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useUpdateQuantity } from '@/data/product';
import Input from '../ui/input';
import Button from '../ui/button';

export type IProps = {
  products: Product[] | undefined;
  // paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const StockList = ({
  products,
  // paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const { permissions } = getAuthCredentials();
  const [getPermission, _] = useAtom(newPermission)
  const canWrite = permissions.includes('super_admin')
    ? siteSettings.sidebarLinks.admin
    : getPermission?.find(
      (permission: any) => permission.type === 'sidebar-nav-item-products'
    )?.write;

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
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

  let columns = [
    // {
    //   title: t('table:table-item-image'),
    //   dataIndex: 'image',
    //   key: 'image',
    //   align: alignLeft,
    //   width: 74,
    //   render: (image: any, { name }: { name: string }) => (
    //     <div className="relative flex h-[42px] w-[42px] items-center">
    //       <Image
    //         src={image?.thumbnail ?? siteSettings.product.placeholder}
    //         alt={name}
    //         fill
    //         sizes="(max-width: 768px) 100vw"
    //         className="overflow-hidden rounded object-fill"
    //       />
    //     </div>
    //   ),
    // },
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
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      width: 300,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (text:any) => (
        <span>{text.name}</span>
      ),

    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-stock')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'quantity'
          }
          isActive={sortingObj.column === 'quantity'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('quantity'),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

  console.log("productsss", products);

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          /* @ts-ignore */
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={products}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {/* {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )} */}
    </>
  );
};

export default StockList;
