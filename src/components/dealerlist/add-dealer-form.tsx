import Input from '@/components/ui/input';
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AddDealerInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { dealerValidationSchema } from './dealer-validation-schema';
import Label from '../ui/label';
import SelectInput from '../ui/select-input';
import ValidationError from '../ui/validation-error';
import { useCategoriesQuery } from '@/data/category';
import { useProductsQuery } from '@/data/product';
import { DatePicker } from '../ui/date-picker';
import { useAddDealerMutation, useUpdateDealerMutation } from '@/data/dealer';
import { useUserQuery } from '@/data/user';
import Loader from '../ui/loader/loader';
import ErrorMessage from '../ui/error-message';
import { useEffect } from 'react';

type FormValues = {
  category: any;
  product: any;
  isActive: Boolean;
  subscriptionType: any;
  name?: string | null;
  email?: string | null;
  discount?: number | null;
  phone?: number | null;
  subscriptionStart?: Date | null;
  walletBalance?: number | null;
  subscriptionEnd?: Date | null;
  username?: string | null;
  password?: string | null;
  marginPerCat?: String | null;
  marginPerPro?: String | null;
};

enum SubscriptionType {
  silver = 'silver',
  gold = 'gold',
  platinum = 'platinum',
}

const StatusType: any = [
  {
    name: "Active",
    value: true
  },
  {
    name: "Inactive",
    value: false
  }
]

type IProps = {
  initialValues?: AddDealerInput | null;
  id?: any | null
};

function SelectCategory({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { categories, loading, error } = useCategoriesQuery({});

  const options: any = categories || []

  return (
    <div className="mt-5">
      <Label>{t('form:input-label-categories')}</Label>
      <SelectInput
        name="category"
        control={control}
        getOptionLabel={(option: any) => `${option.name}`}
        getOptionValue={(option: any) => option}
        options={options}
        isLoading={loading}
        isSearchable={true}
        isMulti={true}
      />
      <ValidationError message={t(errors.categories?.message)} />
    </div>
  );
}

function SelectProduct({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { products, loading } = useProductsQuery({
  });

  const options: any = products || [] 

  return (
    <div className="mt-5">
      <Label>{t('form:input-label-products')}</Label>
      <SelectInput
        name="product"
        control={control}
        getOptionLabel={(option: any) => `${option.name}`}
        getOptionValue={(option: any) => option}
        options={options}
        isLoading={loading}
        isSearchable={true}
        isMulti={true}
      />
      <ValidationError message={t(errors.product?.message)} />
    </div>
  );
}

function SelectSubType({
  defaultValue,
  control,
  errors,
}: {
  control: Control<FormValues>;
  defaultValue:any,
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const options: any = Object.values(SubscriptionType).map((value) => ({ value, name: `${value}` }))
  return (
    <div className="mt-5">
      <Label>{t('form:input-label-dealer-type')}</Label>
      <SelectInput
        name="subscriptionType"
        // defaultValue={defaultValue.subscriptionType}
        control={control}
        getOptionLabel={(option: any) => `${option.name}`}
        getOptionValue={(option: any) => option}
        options={options}
        isSearchable={true}
      />
      <ValidationError message={t(errors.subscriptionType?.message)} />
    </div>
  );
}

function SelectStatus({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const options: any = StatusType.map((status: any) => ({
    label: status.name,
    value: status.value,
  }));
  return (
    <div>
      <Label>{t('Status')}</Label>
      <SelectInput
        name="isActive"
        control={control}
        getOptionLabel={(option: any) => `${option.label}`}
        getOptionValue={(option: any) => option.value}
        options={options}
        isSearchable={true}
      />
      <ValidationError message={t(errors.isActive?.message)} />
    </div>
  );
}

export default function CreateOrUpdateDealerForm({ initialValues, id }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data, isLoading, error } = useUserQuery({ id });
  const user: any = data;

  { isLoading && <Loader text={t('common:text-loading')} /> }
  { error && <ErrorMessage message={error.message} /> }

  const marproduct:any=initialValues?.dealerProductMargins
  const marcategory:any=initialValues?.dealerCategoryMargins

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(dealerValidationSchema),
    defaultValues: {
      ...initialValues,
      ...user,
    },
  });


  const { mutate: createDealer, isLoading: creating } = useAddDealerMutation();
  const { mutate: updateDealer, isLoading: updating } = useUpdateDealerMutation();
  const onSubmit = (values: FormValues) => {
    const isActiveVal: any = values.isActive
    const input = {
      language: router.locale!,
      name: values.name!,
      email: values.email!,
      phone: values.phone!,
      isActive: isActiveVal.value!,
      subscriptionType: values.subscriptionType.name!,
      subscriptionStart: values.subscriptionStart!,
      subscriptionEnd: values.subscriptionEnd!,
      discount: values.discount!,
      walletBalance: values.walletBalance!,
      user: user!,
      dealerCategoryMargins: values.category.map((category: any) => ({
        margin: values.marginPerCat,
        category: category,
      })),
      dealerProductMargins: values.product.map((product: any) => ({
        margin: values.marginPerPro,
        product: product,
      })),
    };

    console.log("moye moye input", input)

    if (!initialValues) {
      createDealer({
        ...input,
        id: '',
        translated_languages: undefined,
      });
    } else {
      updateDealer({
        ...input,
        id: initialValues.id!,
        ...(initialValues?.id && { slug: initialValues.id }),
        translated_languages: undefined,
      });
    };
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Card className="w-full sm:w-8/12 md:w-1/2">
          <Input
            label={t('form:input-label-name')}
            // defaultValue={user?.name}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
          <Input
            label={t('form:input-label-email')}
            defaultValue={user?.email}
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

          <SelectSubType control={control} errors={errors} defaultValue={initialValues}/>

          <Label className="mt-5">{t('Subscription Start')}</Label>

          <Controller
            control={control}
            name="subscriptionStart"
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePicker
                dateFormat="dd/MM/yyyy"
                onChange={onChange}
                onBlur={onBlur}
                selected={value && !isNaN(new Date(value).getTime()) ? new Date(value) : null}
                selectsStart
                startDate={new Date()}
                className="border border-border-base"
              />
            )}
          />
          <Label className="mt-5">{t('Subscription End')}</Label>

          <Controller
            control={control}
            name="subscriptionEnd"
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePicker
                dateFormat="dd/MM/yyyy"
                onChange={onChange}
                onBlur={onBlur}
                selected={value && !isNaN(new Date(value).getTime()) ? new Date(value) : null}
                selectsStart
                startDate={new Date()}
                className="border border-border-base"
              />
            )}
          />

          <Input
            label={t('Wallet Balance')}
            {...register('walletBalance')}
            error={t(errors.walletBalance?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
        </Card>
        <Card className="w-full sm:w-8/12 md:w-1/2">
          <SelectStatus control={control} errors={errors} />
          <SelectCategory control={control} errors={errors} />
          <Input
            // label={t('form:input-label-password')}
            {...register('marginPerCat')}
            defaultValue={marcategory?.map((item:any)=>item.margin)}
            error={t(errors.marginPerCat?.message!)}
            variant="outline"
            className="mt-5"
            placeholder='Margin %'
          // disabled={[].includes(Config.defaultLanguage)}
          />

          <SelectProduct control={control} errors={errors} />
          <Input
            // label={t('form:input-label-password')}
            placeholder='Margin %'
            defaultValue={marproduct?.map((item:any)=>item.margin)}
            {...register('marginPerPro')}
            error={t(errors.marginPerPro?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
          <Input
            label={t('Discount')}
            placeholder='discount %'
            {...register('discount')}
            error={t(errors.discount?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />


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

        <Button type="submit" loading={creating || updating} >
          {initialValues
            ? t('form:button-label-update-dealer')
            : t('form:button-label-create-dealer')}
          {/* {t('form:button-label-update-dealer')} */}
        </Button>
      </div>
    </form>
  );
}
