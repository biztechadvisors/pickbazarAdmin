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
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { newPermission} from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { getAuthCredentials } from '@/utils/auth-utils';
import { AlignType } from 'rc-table/lib/interface';
import Input from '../ui/input';
import Button from '../ui/button';
import { useUpdateStockQuantity } from '@/data/stock';

export type IProps = {
  products: Product[] | undefined;
  me:any;
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
  me,
  onSort,
  onOrder,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const { mutate: updateQuantity, isLoading: updating } = useUpdateStockQuantity();
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
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      width: 64,
      render: (text: string, record: any, index: number) => (
        <span>{index + 1}</span>
      ),
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
      title: t('Stock Available'),
      dataIndex: 'inStock',
      key: 'inStock',
      align: alignLeft,
      render: (inStock: boolean) => (
        <Badge text={t(inStock ? "In Stock":'Out Of Stock')} color={inStock? 'bg-accent' : 'bg-red-500'} />
      ),
    },

    // {
    //   title: t('table:table-item-status'),
    //   dataIndex: 'status',
    //   key: 'status',
    //   align: 'left',
    //   width: 180,
    //   render: (status: string, record: any) => (
    //     <div
    //       className={`flex justify-start ${record?.quantity > 0 && record?.quantity < 10
    //         ? 'flex-col items-baseline space-y-3 3xl:flex-row 3xl:space-x-3 3xl:space-y-0 rtl:3xl:space-x-reverse'
    //         : 'items-center space-x-3 rtl:space-x-reverse'
    //         }`}
    //     >
    //       <Badge
    //         text={status}
    //         color={
    //           status
    //             ? 'bg-yellow-400'
    //             : 'bg-accent'
    //         }
    //       />
    //       {record?.quantity > 0 && record?.quantity < 10 && (
    //         <Badge
    //           text={t('common:text-low-quantity')}
    //           color="bg-red-600"
    //           animate={true}
    //         />
    //       )}
    //     </div>
    //   ),
    // },

    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      render: (status: boolean) => (
        <span>{status? "Active":"Inactive"}</span>
        // <Badge text={t(status ? "In Stock":'Out Of Stock')} color={status? 'bg-accent' : 'bg-red-500'} />
      ),
    },

    {
      title: t('Pending Quantity'),
      dataIndex: 'ordPendQuant',
      key: 'ordPendQuant',
      align: 'center',
      width: 160,
      render: function renderQuantity(ordPendQuant: any) {
        return <span>{ordPendQuant}</span>;
      },
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-quantity')}
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
      render: (quantity: number, record: any) => {
        const [editMode, setEditMode] = useState(false);
        const [editedQuantity, setEditedQuantity] = useState(quantity);
        const [updatedQuantity, setUpdatedQuantity] = useState(quantity);
        const handleShowQuantity = () => {
          setEditMode(true);
        };

        const handleEditQuantity = async () => {
          // Handle logic to save edited quantity
          const data = {
            user_id: me?.id,
            quantity:record.ordPendQuant === 0 && record.quantity || editedQuantity,
            status:record.status,
            inStock:record.inStock,
            ordPendQuant: Math.max(record.ordPendQuant - editedQuantity, 0),
            product:record.product.id,
          };
          updateQuantity(data);
          setUpdatedQuantity(editedQuantity);
          setEditMode(false);
        };


        return (
          <div>
            {editMode ? (
              <>
                <Input
                  type="number"
                  defaultValue={quantity}
                  onChange={(e) => setEditedQuantity(Number(e.target.value))}
                />
                <Button onClick={handleEditQuantity}
                  size='small'
                  className='mt-2'
                >Update</Button>
              </>
            ) : (
              <>
                {/* <Button onClick={handleShowQuantity}>Show</Button> */}
                <span onClick={handleShowQuantity} className='font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none'>{updatedQuantity}</span>
              </>
            )}
          </div>
        );
      },
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
    </>
  );
};

export default StockList;
