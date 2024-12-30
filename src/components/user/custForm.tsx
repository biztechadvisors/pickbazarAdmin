import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import Select from '../ui/select/select';
import Label from '../ui/label';
import Loader from '../ui/loader/loader';

import { useMeQuery, useRegisterMutation } from '@/data/user';
import { usePermissionData } from '@/data/permission';
import { useShopQuery } from '@/data/shop';
import { useAtom } from 'jotai';
import { selectedOption, setUsrEmailState } from '@/utils/atoms';
import { customerValidationSchema } from './user-validation-schema';
import { getAuthCredentials } from '@/utils/auth-utils';
import { Company, DEALER } from '@/utils/constants';
import { useTranslation } from 'react-i18next';

type FormValues = {
  name: string;
  email: string;
  password: string;
  contact: string;
  type: { value: string; label: string };
  numberOfDealers: number;
};

const defaultValues: FormValues = {
  name: '',
  email: '',
  password: '',
  contact: '',
  type: { value: '', label: '' },
  numberOfDealers: 0,
};

const CustForm = ({ onClose, onUserCreated }: { onClose: () => void; onUserCreated: (newUser: any) => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: meData, isLoading: meLoading } = useMeQuery();
  const { mutateAsync: registerUser, isLoading: loading, data: response } = useRegisterMutation();
  const { id } = meData || {};
  const { data: permissionData } = usePermissionData(id);
  const { permissions } = getAuthCredentials();
  const [selectedPermissionType] = useState<any>(null); // Assuming selected permission type is already handled

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

  if (permissions[0] === DEALER) {
    permissionOptions.push(
      { value: 'customer', label: 'customer', id: 'customer_id' },
      { value: 'staff', label: 'staff', id: 'staff_id' }
    );
  }

  async function onSubmit({
    name,
    email,
    password,
    contact,
  }: FormValues) {
    try {
      const response = await registerUser({
        name,
        email,
        password,
        contact,
        createdBy: id,
        permission: selectedPermissionType?.e,
        shopSlug: '',
      });

      if (response?.user) {
        // Notify the parent component about the new user
        onUserCreated(response.user);
        onClose(); // Close modal after successful user registration
      } else {
        console.warn('User or email not found in response:', response);
      }
    } catch (error: any) {
      console.error('Error in onSubmit:', error);
      if (error?.response?.data) {
        Object.keys(error.response.data).forEach((field: string) => {
          setError(field as keyof FormValues, {
            type: 'manual',
            message: error.response.data[field][0],
          });
        });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card className="w-full">
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
        <Label className="mt-4">{t('form:input-label-type')}</Label>
        <Select
          defaultValue={null}
          getOptionLabel={(option: { label: string }) => option.label}
          getOptionValue={(option: { value: string }) => option.value}
          options={permissionOptions}
          isClearable={true}
          isLoading={loading}
          className="mb-4"
        />
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose} // Close modal
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-create-customer')}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default CustForm;
