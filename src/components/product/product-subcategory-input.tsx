import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSubCategoriesQuery } from '@/data/subcategory';
import { useRouter } from 'next/router';

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductSubCategoryInput = ({ control, setValue }: Props) => {
  const { locale, query } = useRouter();
  const { t } = useTranslation('common');

  const shopSlug = query.shops as string;

  const categoryId = useWatch({
    control,
    name: 'categoryId', // Watch for changes in categoryId
  });

  const type = useWatch({
    control,
    name: 'type',
  });

  let defaultsubCategories = useWatch({
    control,
    name: 'subcategories',
  });

  console.log("control._defaultValues.subCategories ", control._defaultValues)

  defaultsubCategories = defaultsubCategories ? defaultsubCategories : control._defaultValues.subCategories;

  console.log("defaultsubCategories ", defaultsubCategories)

  const { subcategories, loading } = useSubCategoriesQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
    categoryId: categoryId || null, // Pass the selected categoryId
    shopSlug, // Pass the shopSlug dynamically
  });

  return (
    <div className="mb-5">
      <Label>{t('form:input-label-subcategories')}</Label>
      <SelectInput
        name="subCategories"
        isMulti
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={subcategories}
        defaultValue={defaultsubCategories}
        isLoading={loading}
      />
    </div>
  );
};

export default ProductSubCategoryInput;
