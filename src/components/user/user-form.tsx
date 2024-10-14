import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { Controller, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useMeQuery, useRegisterMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './user-validation-schema';
import Select from '../ui/select/select';
import Label from '../ui/label';
import { useRouter } from 'next/router';
import { usePermissionData } from '@/data/permission';
import { getAuthCredentials } from '@/utils/auth-utils';
import Loader from '../ui/loader/loader';
import { Company, DEALER, OWNER } from '@/utils/constants';
// import InputMask from 'react-input-mask';
import { useShopQuery } from '@/data/shop';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';

type FormValues = {
  name: string;
  email: string;
  password: string;
  contact: string;
  type: { value: string; label: string };
  createdBy: string;
  numberOfDealers: number; // Added new field type
};

const defaultValues = {
  name: '',
  email: '',
  password: '',
  contact: '',
  type: { value: '', label: '' },
  numberOfDealers: 0, // Added default value for new field
};

const CustomerCreateForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: meData, isLoading: meLoading } = useMeQuery();
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const { id } = meData || {};
  const { data: permissionData } = usePermissionData(id);
  const { permissions } = getAuthCredentials();
  // const phoneRegex = /^\+91[0-9]{10}$/;
  const [value, setValue] = useState('');

  console.log("permissionData",permissionData)

  const shopSlug =
    typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

  const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
    slug: shopSlug as string,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  if (meLoading || !permissionData) {
    return <Loader />;
  }

  const permissionOptions =
    permissionData?.map((permission: { id: any; permission_name: string }) => ({
      value: permission.permission_name,
      label: permission.permission_name,
      id: permission.id,
    })) ?? [];

    console.log("permissionOptions",permissionOptions)



    if (permissions[0] === DEALER || permissions[0] === OWNER || permissions[0] === Company) {
      permissionOptions.push(
        { value: 'Customer', label: 'Customer', id: 'customer_id' },
        { value: 'Staff', label: 'Staff', id: 'staff_id' }
      );
    }
    

  async function onSubmit({
    name,
    email,
    password,
    contact,
    type,
    numberOfDealers, // Added new field to destructure
  }: FormValues) {
    registerUser(
      {
        name,
        email,
        password,
        contact,
        createdBy: id,
        permission: type?.value,
        numberOfDealers,
        managed_shop: shopData, // Added new field to payload
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: string) => {
            setError(field as keyof FormValues, {
              type: 'manual',
              message: error?.response?.data[field][0],
            });
          });
        },
      }
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-4"
          />
          {/* <Input
            label={t('form:input-label-contact')}
            {...register('contact')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.contact?.message!)}
          /> */}
          <Controller
            name="contact"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country="in"
                value={value}
                onChange={onChange}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  paddingLeft: '50px',
                }}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <Label className="mt-4">{t('form:input-label-type')}</Label>
                <Select
                  {...field}
                  getOptionLabel={(option: { label: string }) => option.label}
                  getOptionValue={(option: { value: string }) => option.value}
                  options={permissionOptions}
                  isClearable={true}
                  isLoading={loading}
                  className="mb-4"
                />
              </>
            )}
          />
          {/* {permissions[0] === OWNER ? (
            <Input
              label={t('form:input-label-dealers')}
              {...register('numberOfDealers')}
              type="number"
              variant="outline"
              className="mb-4"
              error={t(errors.numberOfDealers?.message!)}
            />
          ) : null} */}
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>

        <Button loading={loading} disabled={loading}>
          {t('form:button-label-create-customer')}
        </Button>
      </div>
    </form>
  );
};
export default CustomerCreateForm;
