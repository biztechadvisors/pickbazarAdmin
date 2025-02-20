import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useTagsQuery } from '@/data/tag';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductTagInput = ({ control, setValue }: Props) => {
  const { t } = useTranslation();
  const { locale, query } = useRouter();

  const shopSlug = query.shop as string;

  const type = useWatch({
    control,
    name: 'type',
  });

  const defaulttags = useWatch({
    control,
    name: 'tags',
  });

  const { data: shopData } = useShopQuery(
    { slug: shopSlug },
    {
      enabled: !!shopSlug,
    }
  );

  const { tags, loading } = useTagsQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
    shopSlug: shopData?.slug,
  });

  return (
    <div>
      <Label>{t('sidebar-nav-item-tags')}</Label>
      <SelectInput
        name="tags"
        isMulti
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        defaultValue={defaulttags}
        options={tags}
        isLoading={loading}
      />
    </div>
  );
};

export default ProductTagInput;
