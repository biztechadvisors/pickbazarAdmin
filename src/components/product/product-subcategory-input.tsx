import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSubCategoriesQuery } from '@/data/subcategory';
import { useRouter } from 'next/router';

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductSubCategoryInput = ({ control, setValue }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation('common');
  const type = useWatch({
    control,
    name: 'type',
  });
  const { dirtyFields } = useFormState({
    control,
  });

  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('subcategories', []);
    }
  }, [type?.slug]);

  // Extract the 'data' array from the response
  const { subcategories, loading } = useSubCategoriesQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
    categoryId: null,
  });

  return (
    <div className="mb-5">
      <Label>{t('form:input-label-subcategories')}</Label>
      <SelectInput
        name="subcategories"
        isMulti
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={subcategories}
        isLoading={loading}
        defaultValue={[]}
      />
    </div>
  );
};

export default ProductSubCategoryInput;
