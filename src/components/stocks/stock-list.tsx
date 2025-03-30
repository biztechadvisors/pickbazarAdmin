import { Table } from '@/components/ui/table';
import Badge from '@/components/ui/badge/badge';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { useUpdateStockQuantity, useGetStock } from '@/data/stock';
import Select from '../ui/select/select';
import Input from '../ui/input';
import Button from '../ui/button';
import { AllPermission } from '@/utils/AllPermission';
import { SortOrder } from '@/types';

export type IProps = {
  me: any;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: string;
  column: string | null;
};

const StockList = ({ me, onSort, onOrder }: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const { mutate: updateQuantity, isLoading: updating } =
    useUpdateStockQuantity();

  const { data: stocks, isLoading: loading, error } = useGetStock(me.id);

  const permissionTypes = AllPermission();
  const canWrite = permissionTypes.includes('sidebar-nav-item-products');

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
    sort: 'desc',
    column: null,
  });

  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedQuantities, setEditedQuantities] = useState<{ [key: number]: number }>({});

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort(sortingObj.sort === 'desc' ? 'asc' : 'desc');
      onOrder(column!);
      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const handleEditQuantity = (record: any, editedQuantity: number) => {
    const data = {
      user_id: me?.id,
      quantity: editedQuantity,
      status: record.status,
      inStock: record.quantity === 0 ? false : true,
      ordPendQuant: record.ordPendQuant,
      product: record.product.id,
    };
    updateQuantity(data);
    setEditMode((prev) => ({ ...prev, [record.id]: false })); // Close edit mode after updating
    setEditedQuantities((prev) => ({
      ...prev,
      [record.id]: editedQuantity,
    }));
  };

  const handleEditStatus = (record: any, editedStatus: boolean) => {
    const data = {
      user_id: me?.id,
      quantity: record.quantity,
      status: editedStatus,
      inStock: record.inStock,
      ordPendQuant: record.ordPendQuant,
      product: record.product.id,
    };
    updateQuantity(data);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as const,
      width: 64,
    },
    {
      title: 'Product Name',
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      width: 300,
      render: (product: any) => <span>{product.name}</span>,
    },
    {
      title: 'Variation Options',
      dataIndex: 'variation_options',
      key: 'variation_options',
      align: alignLeft,
      width: 300,
      render: (variationOptions: any[]) => (
        <span>
          {variationOptions.map((option) => option.title).join(', ')}
        </span>
      ),
    },
    {
      title: 'In Stock',
      dataIndex: 'inStock',
      key: 'inStock',
      align: 'center' as const,
      render: (inStock: boolean) => (
        <Badge
          text={t(inStock ? 'In Stock' : 'Out Of Stock')}
          color={inStock ? 'bg-accent' : 'bg-red-500'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: boolean, record: any) => {
        const options = [
          { value: true, label: 'True' },
          { value: false, label: 'False' },
        ];

        return (
          <div className="w-full flex justify-center">
            <Select
              options={options}
              onChange={(selectedOption) =>
                handleEditStatus(record, selectedOption.value)
              }
              defaultValue={options.find((option) => option.value === status)}
              name="status"
              placeholder={t('select')}
              className="w-full sm:w-48 md:w-64 lg:w-80" // Responsive width
              menuPlacement="auto" // Automatically adjust dropdown placement
              styles={{
                control: (provided) => ({
                  ...provided,
                  fontSize: '14px', // Base font size
                  '@media (min-width: 640px)': {
                    fontSize: '16px', // Larger font size for sm screens
                  },
                  '@media (min-width: 768px)': {
                    fontSize: '18px', // Larger font size for md screens
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  fontSize: '14px', // Base font size
                  '@media (min-width: 640px)': {
                    fontSize: '16px', // Larger font size for sm screens
                  },
                  '@media (min-width: 768px)': {
                    fontSize: '18px', // Larger font size for md screens
                  },
                }),
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      width: 150,
      render: (quantity: number, record: any) => {
        const isEditMode = editMode[record.id] || false;
        const editedQuantity = editedQuantities[record.id] || quantity;

        return (
          <div>
            {isEditMode ? (
              <>
                <Input
                  type="number"
                  defaultValue={editedQuantity}
                  onChange={(e) =>
                    setEditedQuantities((prev) => ({
                      ...prev,
                      [record.id]: Number(e.target.value),
                    }))
                  }
                />
                <Button
                  onClick={() => handleEditQuantity(record, editedQuantity)}
                  size="small"
                  className="mt-2"
                >
                  Update
                </Button>
              </>
            ) : (
              <span
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, [record.id]: true }))
                }
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {editedQuantity}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  console.log("stocks ", stocks)

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