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
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const ProductList = ({
  products,
  paginatorInfo,
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

  const { mutate: updateQuantity, isLoading: updating } = useUpdateQuantity();

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
      title: t('table:table-item-image'),
      dataIndex: 'image',
      key: 'image',
      align: alignLeft,
      width: 74,
      render: (image: any, { name }: { name: string }) => (
        <div className="relative flex h-[42px] w-[42px] items-center">
          <Image
            src={image?.thumbnail ?? siteSettings.product.placeholder}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw"
            className="overflow-hidden rounded object-fill"
          />
        </div>
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
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 300,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: t('table:table-item-group'),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: (type: any) => (
        <span className="truncate whitespace-nowrap">{type?.name}</span>
      ),
    },
    {
      title: t('table:table-item-shop'),
      dataIndex: 'shop',
      key: 'shop',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: (shop: Shop) => (
        <span className="truncate whitespace-nowrap">{shop?.name}</span>
      ),
    },
    {
      title: 'Product Type',
      dataIndex: 'product_type',
      key: 'product_type',
      width: 120,
      align: 'center',
      render: (product_type: string) => (
        <span className="truncate whitespace-nowrap">{product_type}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-unit')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      width: 180,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number, record: Product) {
        const { price: max_price } = usePrice({
          amount: record?.max_price as number,
        });
        const { price: min_price } = usePrice({
          amount: record?.min_price as number,
        });

        const { price } = usePrice({
          amount: value,
        });

        const renderPrice =
          record?.product_type === ProductType.Variable
            ? `${min_price} - ${max_price}`
            : price;

        return (
          <span className="whitespace-nowrap" title={renderPrice}>
            {renderPrice}
          </span>
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
      render: (quantity: number, id: any) => {
        const [editMode, setEditMode] = useState(false);
        const [editedQuantity, setEditedQuantity] = useState(quantity);
        const [updatedQuantity, setUpdatedQuantity] = useState(quantity);
        const handleShowQuantity = () => {
          setEditMode(true);
        };


        const handleEditQuantity = async () => {
          // Handle logic to save edited quantity
          console.log(`Edited Quantity: ${editedQuantity}`);
          const data = {
            id: id.id,
            quantity: editedQuantity,
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
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 180,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${record?.quantity > 0 && record?.quantity < 10
            ? 'flex-col items-baseline space-y-3 3xl:flex-row 3xl:space-x-3 3xl:space-y-0 rtl:3xl:space-x-reverse'
            : 'items-center space-x-3 rtl:space-x-reverse'
            }`}
        >
          <Badge
            text={status}
            color={
              status.toLocaleLowerCase() === 'draft'
                ? 'bg-yellow-400'
                : 'bg-accent'
            }
          />
          {record?.quantity > 0 && record?.quantity < 10 && (
            <Badge
              text={t('common:text-low-quantity')}
              color="bg-red-600"
              animate={true}
            />
          )}
        </div>
      ),
    },
    {
      ...(canWrite
        &&
      {
        title: t('table:table-item-actions'),

        dataIndex: 'slug',
        key: 'actions',
        align: 'right',
        width: 120,
        render: (slug: string, record: Product) => {
          return (
            <LanguageSwitcher
              slug={slug}
              record={record}
              deleteModalView="DELETE_PRODUCT"
              routes={Routes?.product}
            />
          );
        },
      }
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

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

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
