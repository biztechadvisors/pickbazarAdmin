import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { useTypesQuery } from '@/data/type';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';

type Props = {
  onTypeFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function TypeFilter({ onTypeFilter, className }: Props) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data: meData } = useMeQuery();
  const {
    query: { shops },
  } = useRouter();

  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shops as string,
  });

  const shopId = shopData?.id!;
  const shop_Slug = shopData?.slug
console.log("shop_Slug",shop_Slug)
const shop: string | undefined = meData?.managed_shop?.id;
const shopSlug: string | undefined = meData?.managed_shop?.slug;
 
  const { types, loading } = useTypesQuery({ 
    language: locale,
    shop_id:shop,
    shopSlug: shopSlug,
   });
console.log("types%%%",types)
  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={types?.items || []} 
          isLoading={loading}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t('common:filter-by-group-placeholder')}
          onChange={onTypeFilter}
        />
      </div>
    </div>
  );
}
