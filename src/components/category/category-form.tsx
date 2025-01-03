import Input from '@/components/ui/input';
import {
  Control,
  FieldErrors,
  useForm,
  useFormState,
  useWatch,
} from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import * as categoriesIcon from '@/components/icons/category';
import { getIcon } from '@/utils/get-icon';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useCallback, useEffect, useMemo } from 'react';
import { Category, ItemProps } from '@/types';
import { categoryIcons } from './category-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryValidationSchema } from './category-validation-schema';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/data/category';
import { useTypesQuery } from '@/data/type';
import { useSettingsQuery } from '@/data/settings';
import { useModalAction } from '../ui/modal/modal.context';
import OpenAIButton from '../openAI/openAI.button';
import { useMeQuery } from '@/data/user';
// import { useRegionsQuery } from '@/data/tag';
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

export const updatedIcons = categoryIcons.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex h-5 w-5 items-center justify-center">
        {getIcon({
          iconList: categoriesIcon,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

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
  console.log('REgions===', regions);
  if (error) {
    console.error('Error fetching regions:', error);
  }
  return (
    <div className="mb-5">
      <Label>Select Region</Label>
      <SelectInput
        name="regions"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={regions?.items || []}
        isLoading={!regions} // Show loading state if regions data is not yet loaded
      />
      {/* <ValidationError message={t(errors.type?.message)} /> */}
    </div>
  );
}
function SelectTypes({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { types, loading } = useTypesQuery({ language: locale });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-types')}</Label>
      <SelectInput
        name="type"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.slug}
        options={types?.items || []}
        isLoading={loading}
        defaultValue={[]}
      />
      {/* <ValidationError message={t(errors.type?.message)} /> */}
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
      setValue('parent', []);
    }
  }, [type?.slug]);
  const { categories, loading } = useCategoriesQuery({
    limit: 10,
    type: type?.slug,
    language: locale,
    // shopId,
  });
  return (
    <div>
      <Label>{t('form:input-label-parent-category')}</Label>
      <SelectInput
        name="parent"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={categories}
        isClearable={true}
        isLoading={loading}
        defaultValue={[]}
      />
    </div>
  );
}

type FormValues = {
  regions: any; 
  name: string;
  details: string;
  parent: any;
  image: any;
  icon: any;
  type: any;
  region_name: string;
};

const defaultValues = {
  image: [],
  name: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  region_name: '',
};

type IProps = {
  initialValues?: Category | undefined;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          icon: initialValues?.icon
            ? categoryIcons.find(
                (singleIcon) => singleIcon.value === initialValues?.icon!
              )
            : '',
            // region: initialValues.regions?.length > 0 ? initialValues.regions[0]?.name : '', 
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    resolver: yupResolver(categoryValidationSchema),
  });
 
  const { openModal } = useModalAction();
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

  const { mutate: createCategory, isLoading: creating } =
    useCreateCategoryMutation();
  const { mutate: updateCategory, isLoading: updating } =
    useUpdateCategoryMutation();

  const onSubmit = async (values: FormValues) => {
    const shopIdFromLocalStorage = localStorage.getItem("shopId");
console.log("shopIdFromLocalStorage",shopIdFromLocalStorage)
    if (!shopIdFromLocalStorage) {
      console.error("Shop ID not found in localStorage");
      return;
    }
    const transformedRegions = values.regions?.name ? [values.regions.name] : [];

    const input = {
      language: router.locale,
      name: values.name,
      details: values.details,
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      icon: values.icon?.value || '',
      parent: values.parent?.id ?? null,
      type_id: values.type?.id,
      region_name: transformedRegions,
    };

    if (
      !initialValues ||
      (initialValues.translated_languages &&
        !initialValues.translated_languages?.includes(router.locale!))
    ) {
      createCategory({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
        // shop_id: meData?.managed_shop?.id || initialValues?.shop_id,
        shop_id: shopIdFromLocalStorage || initialValues?.shop_id,
      });
    } else {
      updateCategory({
        ...input,
        id: initialValues.id!,
        // shop_id: meData?.managed_shop?.id,
        shop_id: shopIdFromLocalStorage,
      });
    }
  };

  console.log('categoery-----------------initialvalue', initialValues);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:category-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:category-description-helper-text')}`}
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

          <div className="mb-5">
            <Label>{t('form:input-label-select-icon')}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
              defaultValue={[]}
            />
          </div>
          {/* <div className="mb-5">
          <SelectInput
    name="region"
    control={control}
    options={countryOptions}
    isClearable={true}
    defaultValue={[]}
  />
  </div>   */}
          <SelectRegion control={control} errors={errors} />
          <SelectTypes control={control} errors={errors} />
          <SelectCategories control={control} setValue={setValue} />
        </Card>
      </div>
      <div className="mb-4 text-end">
        {/* {initialValues && ( */}
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>
        {/* )} */}

        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update-category')
            : t('form:button-label-add-category')}
        </Button>
      </div>
    </form>
  );
}
