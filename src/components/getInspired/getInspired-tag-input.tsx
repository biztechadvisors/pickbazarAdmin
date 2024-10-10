import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTagsQuery } from '@/data/tag'; // Assuming the same query logic applies
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop'; // Modify if not needed for GetInspired

interface Props {
  control: Control<any>;
  setValue: any;
}

const GetInspiredTagInput = ({ control, setValue }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;

  const type = useWatch({
    control,
    name: 'type', // This will still watch the "type" field to react to changes
  });

  const { dirtyFields } = useFormState({
    control,
  });

  // Reset the tags if the "type" changes and the form is dirty
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('tagIds', []); // Reset the tags field
    }
  }, [type?.slug]);

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    }
  );

  const { tags, loading } = useTagsQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
    shopSlug: shopData?.slug, // Adjust this if necessary for Get Inspired
  });

  return (
    <div>
      <Label>{t('form:input-label-tags')}</Label>
      <SelectInput
        name="tagIds" // Changed to match your "tagIds" field from DTO
        isMulti
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={tags}
        isLoading={loading}
      />
    </div>
  );
};

export default GetInspiredTagInput;
