import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { Table } from '@/components/ui/table';
import { siteSettings } from '@/settings/site.settings';
import Badge from '@/components/ui/badge/badge';
import { useIsRTL } from '@/utils/locals';
import TitleWithSort from '@/components/ui/title-with-sort';
import Input from '../ui/input';
import Button from '../ui/button';
import Select from '../ui/select/select';
import { useGetStock, useUpdateStockQuantity } from '@/data/stock';
import { getAuthCredentials } from '@/utils/auth-utils';
import { newPermission } from '@/contexts/permission/storepermission';
import { Product, SortOrder } from '@/types';
import { AlignType } from 'rc-table/lib/interface';

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

export type IProps = {
  me: any;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const StockList = ({
  me,
  onSort,
  onOrder,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const { mutate: updateQuantity } = useUpdateStockQuantity();
  const { permissions } = getAuthCredentials();
  const [getPermission] = useAtom(newPermission);
  const { data: stocks, isLoading: loading } = useGetStock(me?.id);
  const canWrite = permissions?.includes('super_admin')
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
      const newSortOrder = sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
      onSort(newSortOrder);
      onOrder(column!);
      setSortingObj({
        sort: newSortOrder,
        column,
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
      render: (_text: string, _record: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'}
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
      render: (text: any) => <span>{text.name}</span>,
    },
    {
      title: t('Stock Available'),
      dataIndex: 'inStock',
      key: 'inStock',
      align: 'center' as AlignType,
      render: (inStock: boolean) => (
        <Badge text={t(inStock ? 'In Stock' : 'Out Of Stock')} color={inStock ? 'bg-accent' : 'bg-red-500'} />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      render: (status: boolean, record: any) => {
        const options = [
          { value: true, label: 'True' },
          { value: false, label: 'False' },
        ];

        const onStatusChange = (selectedOption: any) => {
          const data = {
            user_id: me?.id,
            quantity: record.quantity,
            status: selectedOption.value,
            inStock: record.inStock,
            ordPendQuant: record.ordPendQuant,
            product: record.product.id,
          };
          updateQuantity(data);
        };

        return (
          <Select
            options={options}
            onChange={onStatusChange}
            defaultValue={options.find(option => option.value === status)}
            name="status"
            placeholder={t('select')}
          />
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('Pending Quantity')}
          ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'ordPendQuant'}
          isActive={sortingObj.column === 'ordPendQuant'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'ordPendQuant',
      key: 'ordPendQuant',
      align: 'center' as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('ordPendQuant'),
      render: (quantity: number, record: any) => {
        const [editMode, setEditMode] = useState(false);
        const [editedQuantity, setEditedQuantity] = useState(quantity);
        const [updatedQuantity, setUpdatedQuantity] = useState(quantity);

        const handleEditQuantity = async () => {
          const data = {
            user_id: me?.id,
            quantity: record.quantity,
            status: record.status,
            inStock: record.inStock,
            ordPendQuant: editedQuantity,
            product: record.product.id,
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
                  name=""
                />
                <Button onClick={handleEditQuantity} size="small" className="mt-2">
                  {t('Update')}
                </Button>
              </>
            ) : (
              <span
                onClick={() => setEditMode(true)}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {updatedQuantity}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-quantity')}
          ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'quantity'}
          isActive={sortingObj.column === 'quantity'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('quantity'),
      render: (quantity: number, record: any) => {
        const [editMode, setEditMode] = useState(false);
        const [editedQuantity, setEditedQuantity] = useState(quantity);
        const [updatedQuantity, setUpdatedQuantity] = useState(quantity);

        const handleEditQuantity = async () => {
          const data = {
            user_id: me?.id,
            quantity: editedQuantity,
            status: record.status,
            inStock: editedQuantity === 0 ? false : true,
            ordPendQuant: record.ordPendQuant,
            product: record.product.id,
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
                  name=""
                />
                <Button onClick={handleEditQuantity} size="small" className="mt-2">
                  {t('Update')}
                </Button>
              </>
            ) : (
              <span
                onClick={() => setEditMode(true)}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {updatedQuantity}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if (router?.query?.shop) {
    columns = columns.filter((column) => column?.key !== 'shop');
  }

  return (
    <div className="mb-6 overflow-hidden rounded shadow">
      <Table
        /* @ts-ignore */
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={stocks}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default StockList;
