import Input from '@/components/ui/input';
import {
  Control,
  useForm,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { split, join, isEmpty } from 'lodash';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubCategory, ItemProps } from '@/types';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { subcategoryValidationSchema } from './subcategory-validation-schema';
import {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from '@/data/subcategory';
import { useCategoriesQuery } from '@/data/category';
import { useSettingsQuery } from '@/data/settings';
import { useModalAction } from '../ui/modal/modal.context';
import OpenAIButton from '../openAI/openAI.button';
import { useMeQuery } from '@/data/user';
import { Config } from '@/config';
import { EditIcon } from '../icons/edit';
import ValidationError from '@/components/ui/form-validation-error';
import { useRegionsQuery } from '@/data/regions';

export const chatbotAutoSuggestion = ({ name }: { name: string }) => {
  return [
    {
      id: 1,
      title: `Introduce our new category: ${name} products that cater to [target audience].`,
    },
    {
      id: 2,
      title: `Explore our latest category: ${name} products designed to [address specific customer needs].`,
    },
    {
      id: 3,
      title: `Discover our fresh category: ${name} products that combine style, functionality, and affordability.`,
    },
    {
      id: 4,
      title: `Check out our newest addition: ${name} products that redefine [industry/segment] standards.`,
    },
    {
      id: 5,
      title: `Elevate your experience with our curated ${name} products.`,
    },
    {
      id: 6,
      title: `Enhance your lifestyle with our diverse range of ${name} products.`,
    },
    {
      id: 7,
      title: `Experience the innovation of our cutting-edge ${name} products.`,
    },
    {
      id: 8,
      title: `Simplify [specific task/activity] with our innovative ${name} products.`,
    },
    {
      id: 9,
      title: `Transform the way you [specific activity/task] with our game-changing ${name} products.`,
    },
    {
      id: 10,
      title: `Unleash the potential of your [target audience] with our exceptional ${name} products.`,
    },
  ];
};
function SelectRegion({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation(); 

  const { data: meData } = useMeQuery();

  const ShopSlugName = 'hilltop-marble';
  // const { data: me } = useMeQuery()

  const { regions, loading, paginatorInfo, error } = useRegionsQuery({
    code: meData?.managed_shop?.slug,
  });
console.log("REgions===",regions);
  if (error) {
    console.error("Error fetching regions:", error);
  }
  return (
    <div className="mb-5">
      <Label>Select Region</Label>
      <SelectInput
        name="region"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={regions || []}
        isLoading={!regions}  
      />
    <ValidationError message={t(errors.type?.message)} />
    </div>
  );
}

function SelectCategories({
  control,
  setValue,
}: {
  control: Control<FormValues>;
  setValue: any;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const type = useWatch({
    control,
    name: 'type',
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('category_id', []);
    }
  }, [type?.slug]);

  const { categories, loading } = useCategoriesQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
  });
  return (
    <div>
      <Label>{t('form:input-label-parent-category')}</Label>
      <SelectInput
        name="category_id"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={categories}
        isClearable={true}
        isLoading={loading}
        defaultValue={control._defaultValues}
      />
    </div>
  );
}

type FormValues = {
  name: string;
  details: string;
  category_id: any;
  image: any;
  type: any;
  slug: string;
  region_name:string;
};

const defaultValues = {
  image: [],
  name: '',
  details: '',
  category_id: '',
  type: '',
  slug: '',
  region_name:'',
};

type IProps = {
  initialValues?: SubCategory | undefined;
};
export default function CreateOrUpdateSubCategoriesForm({
  initialValues,
}: IProps) {

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const router = useRouter();
  const { t } = useTranslation();
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const isNewTranslation = router?.query?.action === 'translate';

  const [formValues, setFormValues] = useState<FormValues>(initialValues || defaultValues);

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    } else {
      setFormValues(defaultValues);
    }
  }, [initialValues]);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: formValues,
    resolver: yupResolver(subcategoryValidationSchema), // Replace with your actual schema
  });

  const { data: meData } = useMeQuery();

  const shop = meData?.managed_shop.id;

  const { openModal } = useModalAction();
  const slugAutoSuggest = join(split(watch('name'), ' '), '-').toLowerCase();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('name');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'details',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [generateName]);

  const { mutate: createSubCategory, isLoading: creating } =
    useCreateSubCategoryMutation();
  const { mutate: updateSubCategory, isLoading: updating } =
    useUpdateSubCategoryMutation();

  const onSubmit = async (values: FormValues) => {
    console.log("values####",values)
    const transformedRegions = values.region?.name ? [values.region.name] : [];
    const input = {
      language: router.locale,
      name: values.name,
      details: values.details,
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      category_id: values.category?.id ?? null,

      shop_id: shop,
      regionName: transformedRegions,
    };
    if (
      !initialValues ||
      (initialValues.language &&
        !initialValues.language.includes(router.locale!))
    ) {
      createSubCategory({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
        shop_id: meData?.managed_shop?.id || initialValues?.shop_id,
      });
    } else {
      updateSubCategory({
        ...input,
        id: initialValues.id!,
        shop_id: meData?.managed_shop?.id,
      });
    }
    console.log("Category ID:", values.category_id);

  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:subcategory-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${initialValues
            ? t('form:item-description-edit')
            : t('form:item-description-add')
            } ${t('form:subcategory-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          {isSlugEditable ? (
            <div className="relative mb-5">
              <Input
                label={`${t('Slug')}`}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                variant="outline"
                disabled={isSlugDisable}
              />
              <button
                className="absolute top-[27px] right-px z-10 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                type="button"
                title={t('common:text-edit')}
                onClick={() => setIsSlugDisable(false)}
              >
                <EditIcon width={14} />
              </button>
            </div>
          ) : (
            <Input
              label={`${t('Slug')}`}
              {...register('slug')}
              value={slugAutoSuggest}
              variant="outline"
              className="mb-5"
              disabled
            />
          )}

          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title="Generate Description With AI"
                onClick={handleGenerateDescription}
              />
            )}
            <TextArea
              label={t('form:input-label-details')}
              {...register('details')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <SelectCategories control={control} setValue={setValue} />
          <SelectRegion control={control} errors={errors} />
        </Card>
      </div>
      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update-subcategory')
            : t('form:button-label-add-subcategory')}
        </Button>
      </div>
    </form>
  );
}
