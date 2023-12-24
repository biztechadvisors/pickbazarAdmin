import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './dealer-validation-schema';
import { useCreateTypeMutation, useUpdateTypeMutation } from '@/data/type';
import Select from '../ui/select/select';
import Radio from '../ui/radio/radio';
import PasswordInput from '../ui/password-input';

type FormValues = {
  name?: string | null;
  email?: string | null;
  phone?: number | null;
  address?: string | null;
  accounttype?: string | null;
  username?: string | null;
  password?: string | null;
  marginPerCat?: String | null;
  marginPerPro?: String | null;
  selectCategory?: String | null;
  selectProduct?: String | null;
};

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(typeValidationSchema),
    defaultValues: {
      ...initialValues,
      // @ts-ignore
    },
  });

  const { mutate: createType, isLoading: creating } = useCreateTypeMutation();
  const { mutate: updateType, isLoading: updating } = useUpdateTypeMutation();
  const onSubmit = (values: FormValues) => {
    const selectedCategory = watch('selectCategory');
    const selectedProduct = watch('selectProduct');
    const input = {
      language: router.locale,
      name: values.name!,
      email: values.email!,
      phone: values.phone!,
      address: values.address!,
      accounttype: values.accounttype!,
      username: values.username!,
      password: values.password!,
      marginCategory: values.marginPerCat,
      marginProduct: values.marginPerPro,
      selectedCategory,
      selectedProduct,
    };

    console.log("first",input)

    if (
      !initialValues ||
      !initialValues.translated_languages.includes(router.locale!)
    ) {
      createType({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
      });
    } else {
      updateType({
        ...input,
        id: initialValues.id!,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Card className="w-full sm:w-8/12 md:w-1/2">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            error={t(errors.email?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
          <Input
            label={t('form:input-label-phone')}
            {...register('phone')}
            error={t(errors.phone?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />

          <Input
            label={t('form:input-label-address')}
            {...register('address')}
            error={t(errors.address?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />

          <Input
            label={t('form:input-label-account-type')}
            {...register('accounttype')}
            error={t(errors.accounttype?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
        </Card>
        <Card className="w-full sm:w-8/12 md:w-1/2">
          <label htmlFor="selectCategory" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Category Margin"}</label>
          <Controller
            name="selectCategory"
            control={control}
            render={({ field }) => (
              <Select
                id="selectCategory"
                // name={field.name}
                options={options}
                placeholder={t('Select Category')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          

          <Input
            // label={t('form:input-label-password')}
            {...register('marginPerCat')}
            error={t(errors.marginPerCat?.message!)}
            variant="outline"
            className="mt-5"
            placeholder='Margin %'
          // disabled={[].includes(Config.defaultLanguage)}
          />

        <label htmlFor="selectProduct" className='mb-3 block text-sm font-semibold leading-none text-body-dark mt-5'>{"Product Margin"}</label>
          <Controller
            name="selectProduct"
            control={control}
            render={({ field }) => (
              <Select
                id="selectProduct"
                // name={field.name}
                options={options}
                placeholder={t('Select Product')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
         

          <Input
            // label={t('form:input-label-password')}
            placeholder='Margin %'
            {...register('marginPerPro')}
            error={t(errors.marginPerPro?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Card className="w-full sm:w-8/12 md:w-1/2">
          <Input
            label={t('form:input-label-username')}
            {...register('username')}
            error={t(errors.username?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
        </Card>
        {/* <Card className="w-full sm:w-8/12 md:w-1/2">
          
        </Card> */}
      </div>
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:group-settings')}
          details={t('form:group-settings-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        /> */}
      {/* <Card className="w-full sm:w-8/12 md:w-2/3">
          <Checkbox
            {...register('settings.isHome')}
            error={t(errors.settings?.isHome?.message!)}
            label={t('form:input-label-is-home')}
            className="mb-5"
          />
          <div className="mb-10">
            <Label className="mb-5">{t('form:input-label-layout-type')}</Label>

            <div className="grid grid-cols-3 gap-5">
              {layoutTypes?.map((layout, index) => {
                return (
                  <RadioCard
                    key={index}
                    {...register('settings.layoutType')}
                    label={t(layout.label)}
                    value={layout.value}
                    src={layout.img}
                    id={layout?.value}
                  />
                );
              })}
            </div>
          </div>
          <div className="mb-5">
            <Label className="mb-5">
              {t('form:input-label-product-card-type')}
            </Label>

            <div className="grid grid-cols-3 gap-5">
              {productCards?.map((productCard, index) => {
                return (
                  <RadioCard
                    key={`product-card-${index}`}
                    {...register('settings.productCard')}
                    label={t(productCard.label)}
                    value={productCard.value}
                    src={productCard.img}
                    id={`product-card-${index}`}
                  />
                );
              })}
            </div>
          </div>
        </Card>
      </div> */}
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
            ? t('form:button-label-update-dealer')
            : t('form:button-label-add-dealerlist')}
        </Button>
      </div>
    </form>
  );
}
