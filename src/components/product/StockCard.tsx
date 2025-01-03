import Image from 'next/image';
import usePrice from '@/utils/use-price';
import { productPlaceholder } from '@/utils/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useTranslation } from 'next-i18next';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Product, ProductType } from '@/types';
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { siteSettings } from '@/settings/site.settings';
import { AddToStock } from '../stock/add-to-stock';
import { AllPermission } from '@/utils/AllPermission';

interface Props {
  item: Product;
  isChecked: boolean;
  id: number;
  email: string;
  phone: string;
  inStock: boolean;
}

const StockCard = ({ item, isChecked, inStock }: Props) => {
  const { t } = useTranslation();
  const {
    slug,
    name,
    image,
    product_type,
    quantity,
    price,
    max_price,
    min_price,
    sale_price,
    margin,
  } = item ?? {};
  console.log("item",item)
  const {
    price: currentPrice,
    basePrice,
    discount,
  } = usePrice({
    amount: sale_price ? sale_price : price!,
    baseAmount: price ?? 0,
  });
  const { price: minPrice } = usePrice({
    amount: min_price ?? 0,
  });
  const { price: maxPrice } = usePrice({
    amount: max_price ?? 0,
  });

  const { openModal } = useModalAction();

  // const [getPermission, _] = useAtom(newPermission);
  // const { permissions } = getAuthCredentials();
  // const canWrite = permissions.includes('super_admin')
  //   ? siteSettings.sidebarLinks
  //   : getPermission?.find(
  //       (permission) => permission.type === 'sidebar-nav-item-create-order'
  //     )?.write;

  const permissionTypes = AllPermission(); 

  const canWrite = permissionTypes.includes('sidebar-nav-item-create-order');

  function handleVariableProduct() {
    return openModal('SELECT_PRODUCT_VARIATION', slug);
  }

  return (
    <div className="cart-type-neon h-full overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="relative flex h-48 w-auto items-center justify-center sm:h-64">
        <span className="sr-only">{t('text-product-image')}</span>
        <Image
          src={image?.thumbnail}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="product-image object-contain"
        />

        {isChecked && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-2 rounded-md bg-green-600 p-2 text-light">
              <span className="text-xs md:text-sm">${margin}</span>
            </div>
          </div>
        )}

        {discount && (
          <div className="absolute top-3 rounded bg-accent px-1.5 text-xs font-semibold leading-6 text-light end-3 sm:px-2 md:top-4 md:px-2.5 md:end-4">
            {discount}
          </div>
        )}
      </div>

      <header className="p-3 md:p-6">
        {product_type === ProductType.Variable ? (
          <div className="mb-2">
            <span className="text-sm font-semibold text-heading md:text-base">
              {minPrice}
            </span>
            <span> - </span>
            <span className="text-sm font-semibold text-heading md:text-base">
              {maxPrice}
            </span>
          </div>
        ) : (
          <div className="mb-2 flex items-center">
            <span className="text-sm font-semibold text-heading md:text-base">
              {currentPrice}
            </span>
            {basePrice && (
              <del className="text-xs text-muted ms-2 md:text-sm">
                {basePrice}
              </del>
            )}
          </div>
        )}

        <h3 className="mb-4 truncate text-xs text-body md:text-sm">{name}</h3>

        {inStock ? (
          product_type === ProductType.Variable ? (
            <>
              {Number(quantity) > 0 && (
                <button
                  onClick={handleVariableProduct}
                  className="group flex h-7 w-full items-center justify-between rounded bg-gray-100 text-xs text-body-dark transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:text-sm"
                >
                  <span className="flex-1">{t('text-add')}</span>
                  <span className="grid h-7 w-7 place-items-center bg-gray-200 transition-colors duration-200 rounded-te rounded-be group-hover:bg-accent-600 group-focus:bg-accent-600 md:h-9 md:w-9">
                    <PlusIcon className="h-4 w-4 stroke-2" />
                  </span>
                </button>
              )}
            </>
          ) : (
            canWrite && (
              <>
                {Number(quantity) > 0 && (
                  <AddToStock variant="neon" data={item} />
                )}
              </>
            )
          )
        ) : (
          <div className="rounded bg-red-500 px-2 py-1 text-xs text-light">
            Out of Stock
          </div>
        )}
      </header>
    </div>
  );
};

export default StockCard;
