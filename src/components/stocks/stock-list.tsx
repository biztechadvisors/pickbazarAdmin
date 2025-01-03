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

const EditableQuantity = ({ record, me }: any) => {
  const [editMode, setEditMode] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(record.quantity);
  const [updatedQuantity, setUpdatedQuantity] = useState(record.quantity);
  const { mutate: updateQuantity } = useUpdateStockQuantity();

  const handleEditQuantity = async () => {
    const data = {
      user_id: me?.id,
      quantity: editedQuantity,
      status: record.status,
      inStock: record.inStock,
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
            defaultValue={editedQuantity}
            onChange={(e) => setEditedQuantity(Number(e.target.value))}
          />
          <Button onClick={handleEditQuantity} size="small" className="mt-2">
            Update
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
};

const EditablePendingQuantity = ({ record, me }: any) => {
  const [editMode, setEditMode] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(record.ordPendQuant);
  const [updatedQuantity, setUpdatedQuantity] = useState(record.ordPendQuant);
  const { mutate: updateQuantity } = useUpdateStockQuantity();

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
            defaultValue={editedQuantity}
            onChange={(e) => setEditedQuantity(Number(e.target.value))}
          />
          <Button onClick={handleEditQuantity} size="small" className="mt-2">
            Update
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
};

const StockList = ({ me, onSort, onOrder }: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const { mutate: updateQuantity, isLoading: updating } =
    useUpdateStockQuantity();

  const { data: stocks, isLoading: loading, error } = useGetStock(me?.id);
 

  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-products');

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
    sort: 'desc',
    column: null,
  });

  console.log('sortingObj',sortingObj)
  console.log("Product",Product)

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
    setEditModeIndex(null);  // Close edit mode after updating
    setEditedQuantities((prev) => ({
      ...prev,
      [record.id]: editedQuantity,
    }));
  };

  let columns = [
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as const,
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
      render: (text: any) => <span>{text.name}</span>,
    },

    {
      title: (
        <TitleWithSort
          title={t('Product Type')}
          // ascending={
          //   sortingObj.sort === SortOrder.Asc && sortingObj.column === 'product_type'
          // }
          // isActive={sortingObj.column === 'product_type'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'product',
      key: 'product_type',
      align: alignLeft,
      width: 300,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('product_type'),
      render: (text: any) => <span>{text.product_type}</span>,
    },

    // {
    //   title: t('Product Variation'),
    //   dataIndex: 'inStock',
    //   key: 'inStock',
    //   align: 'center',
    //   render: (inStock: boolean) => (
    //     <Badge
    //       text={t(inStock ? 'In Stock' : 'Out Of Stock')}
    //       color={inStock ? 'bg-accent' : 'bg-red-500'}
    //     />
    //   ),
    // },
    

    {
      title: t('Stock Available'),
      dataIndex: 'inStock',
      key: 'inStock',
      align: 'center' as const,
      render: (inStock: boolean) => (
        <Badge text={t(inStock ? 'In Stock' : 'Out Of Stock')} color={inStock ? 'bg-accent' : 'bg-red-500'} />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: boolean, record: any) => {
        const options = [
          { value: true, label: 'True' },
          { value: false, label: 'False' },
        ];

        const onOrderChange = (selectedOption: any) => {

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
          <>
            <div>
              <Select
                options={options}
                onChange={onOrderChange}
                defaultValue={options.find((option) => option.value === status)}
                name="status"
                placeholder={t('select')}
              />
            </div>
          </>
        );
      },
    },

    {
      title: (
        <TitleWithSort
          title={t('Pending Quantity')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'quantity'
          }
          isActive={sortingObj.column === 'quantity'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'ordPendQuant',
      key: 'ordPendQuant',
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
                  name={''}
                />
                <Button
                  onClick={handleEditQuantity}
                  size="small"
                  className="mt-2"
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                {/* <Button onClick={handleShowQuantity}>Show</Button> */}
                <span
                  onClick={handleShowQuantity}
                  className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
                >
                  {updatedQuantity}
                </span>
              </>
            )}
          </div>
        );
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
            quantity: editedQuantity,
            status: record.status,
            inStock: (record.quantity === 0 && false) || true,
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
                  name={''}
                />
                <Button
                  onClick={handleEditQuantity}
                  size="small"
                  className="mt-2"
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                {/* <Button onClick={handleShowQuantity}>Show</Button> */}
                <span
                  onClick={handleShowQuantity}
                  className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
                >
                  {updatedQuantity}
                </span>
              </>
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
