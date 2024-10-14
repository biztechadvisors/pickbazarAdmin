import Input from '@/components/ui/input';
import { Control, Controller, FieldErrors, UseFormRegister, useFieldArray, useForm } from 'react-hook-form';
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
import dynamic from 'next/dynamic';
import {
  billingAddressAtom,
  // customerAtom,
  shippingAddressAtom,
} from '@/contexts/checkout';
import { AddressType } from '@/types';
import { useAtomValue } from 'jotai';

type FormValues = {
  category: any;
  product: any;
  isActive: Boolean;
  subscriptionType: any;
  name?: string | null;
  email?: string | null;
  discount?: number | null;
  phone?: number | null;
  walletBalance?: number | null;
  username?: string | null;
  password?: string | null;
  marginPerCat?: String | null;
  marginPerPro?: String | null;
  dealerCategoryMargins: {
    category: any;
    margin: string;
  }[];
  dealerProductMargins: {
    product: any;
    margin: string;
  }[];
  gst?: string | null;
  pan?: string | null;
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
  register,
  defaultValue,
  control,
  errors,
}: {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  defaultValue: any;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { categories, loading, error } = useCategoriesQuery({});
  const options: any = categories || [];
  const dbValues: any = defaultValue || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dealerCategoryMargins',
  });

  return (
    <div className="mt-5">
      <Label>{t('form:input-label-categories')}</Label>

      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center">
          <SelectInput
            name={`dealerCategoryMargins[${index}].category`}
            control={control}
            defaultValue={dbValues[index]?.category || null}
            getOptionLabel={(option: any) => `${option.name}`}
            getOptionValue={(option: any) => option.name}
            options={options}
            isLoading={loading}
            isSearchable={true}
          />

          <Input
            {...register(`dealerCategoryMargins.${index}.margin` as const)}
            defaultValue={dbValues[index]?.margin || ''}
            variant="outline"
            className="ml-5 mb-3"
            placeholder={t('margin %')}
          />

          <button
            onClick={() => {
              remove(index);
            }}
            type="button"
            className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4 ml-3"
          >
            {t('form:button-label-remove')}
          </button>
        </div>
      ))}

      <Button className='mt-4' type="button" onClick={() => append({ category: null, margin: '' })}>
        {t('form:button-label-add-category')}
      </Button>

      <ValidationError message={t(errors.category?.message)} />
    </div>
  );
}



function SelectProduct({
  register,
  defaultValue,
  control,
  errors,
}: {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  defaultValue: any;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { products, loading, error } = useProductsQuery({});
  const options: any = products || [];
  const dbValues: any = defaultValue || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dealerProductMargins',
  });

  return (
    <div className="mt-5">
      <Label>{t('form:input-label-products')}</Label>

      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center">
          <SelectInput
            name={`dealerProductMargins[${index}].product`}
            control={control}
            defaultValue={dbValues[index]?.product || null}
            getOptionLabel={(option: any) => `${option.name}`}
            getOptionValue={(option: any) => option.name}
            options={options}
            isLoading={loading}
            isSearchable={true}
          />

          <Input
            {...register(`dealerProductMargins.${index}.margin` as const)}
            defaultValue={dbValues[index]?.margin || ''}
            variant="outline"
            className="ml-5 mb-3"
            placeholder={t('margin %')}
          />

          <button
            onClick={() => {
              remove(index);
            }}
            type="button"
            className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4 ml-3"
          >
            {t('form:button-label-remove')}
          </button>
        </div>
      ))}

      <Button className='mt-4' type="button" onClick={() => append({ product: null, margin: '' })}>
        {t('form:button-label-add-product')}
      </Button>

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
  defaultValue: any,
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const options: any = Object.values(SubscriptionType).map((value) => ({ value, name: `${value}` }))
  return (
    <div className="mt-5">
      <Label>{t('form:input-label-dealer-type')}</Label>
      <SelectInput
        name="subscriptionType"
        defValue={defaultValue.subscriptionType}
        control={control}
        getOptionLabel={(option: any) => `${option.name}`}
        getOptionValue={(option: any) => option}
        options={options}
        isSearchable={false}
        defaultValue={[]}
      />
      <ValidationError message={t(errors.subscriptionType?.message)} />
    </div>
  );
}


function SelectStatus({
  defaultValue,
  control,
  errors,
}: {
  control: Control<FormValues>;
  defaultValue: any,
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
        defValue={defaultValue.isActive ? "Active" : "Inactive"}
        getOptionLabel={(option: any) => `${option.label}`}
        getOptionValue={(option: any) => option.value}
        options={options}
        isSearchable={false}
        defaultValue={[]}
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

  const marproduct: any = `{initialValues?.dealerProductMargins}`
  const marcategory: any = `initialValues?.dealerCategoryMargins`

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
  const AddressGrid = dynamic(() => import('@/components/checkout/address-grid'));
  const billingAddresses = useAtomValue(billingAddressAtom);
  const shippingAddresses = useAtomValue(shippingAddressAtom);
  const onSubmit = (values: FormValues) => {
    const isActiveVal: any = values.isActive;
  
    const input = {
      language: router.locale!,
      name: values.name!,
      email: values.email!,
      phone: values.phone!,
      isActive: isActiveVal.value!,
      subscriptionType: values.subscriptionType.name!,
      discount: values.discount!,
      walletBalance: values.walletBalance!,
      user: user!,
      dealerCategoryMargins: values.dealerCategoryMargins,
      dealerProductMargins: values.dealerProductMargins,
      gst: values.gst,
      pan: values.pan,
      billingAddresses: billingAddresses,
      shippingAddresses: shippingAddresses,
    };

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

          <SelectSubType control={control} errors={errors} defaultValue={initialValues} />

          <Input
            label={t('Wallet Balance')}
            {...register('walletBalance')}
            error={t(errors.walletBalance?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />

          <Input
            label={t('GST')}
            {...register('gst')}
            error={t(errors.gst?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />

          <Input
            label={t('PAN')}
            {...register('pan')}
            error={t(errors.pan?.message!)}
            variant="outline"
            className="mt-5"
          // disabled={[].includes(Config.defaultLanguage)}
          />
        </Card>
        <Card className="w-full sm:w-8/12 md:w-1/2">
          <SelectStatus control={control} errors={errors} defaultValue={initialValues} />
          <SelectCategory register={register} control={control} errors={errors} defaultValue={marcategory} />
          <SelectProduct register={register} control={control} errors={errors} defaultValue={marproduct} />
          <AddressGrid
            userId={user?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-billing-address')}
            // count={3}
            // addresses={user?.address?.filter(
            //     (address) => address?.type === AddressType.Billing
            // )}
            atom={billingAddressAtom}
            type={AddressType.Billing}
          />

          <AddressGrid
            userId={user?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-shipping-address')}
            // count={4}
            // addresses={user?.address?.filter(
            //     (address) => address?.type === AddressType.Shipping
            // )}
            atom={shippingAddressAtom}
            type={AddressType.Shipping}
          />
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
