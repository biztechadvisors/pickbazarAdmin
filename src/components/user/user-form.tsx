import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Select from '../ui/select/select';
import Label from '../ui/label';
import Loader from '../ui/loader/loader';

import { customerValidationSchema } from './user-validation-schema';
import { useMeQuery, useRegisterMutation, useUpdateUserMutation } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { getAuthCredentials } from '@/utils/auth-utils';
import { usePermissionData } from '@/data/permission';
import useFormValues from '@/lib/hooks/use-form-values';
import { Routes } from '@/config/routes';
import { permissionType } from '@/types';

type FormValues = {
  name: string;
  email: string;
  password?: string;
  contact: string;
  type: { value: string; label: string; id?: string };
};

const defaultValues: FormValues = {
  name: '',
  email: '',
  password: '',
  contact: '',
  type: { value: '', label: '' },
};

const CustomerCreateForm = ({ initialValues }: { initialValues?: any }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: meData, isLoading: meLoading } = useMeQuery();
  const { mutate: registerUser, isLoading: registering } = useRegisterMutation();
  const { mutate: updateUser, isLoading: updating } = useUpdateUserMutation();
  const { data: permissionData } = usePermissionData();
  const { permissionOptions: getPermissionOptions } = useFormValues();

  const { id: currentUserId } = meData || {};
  const { permissions } = getAuthCredentials();
  const { id } = router.query;

  const shopSlug = typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;
  const { data: shopData } = useShopQuery({ slug: shopSlug as string });

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
        name: initialValues.name,
        email: initialValues.email,
        contact: initialValues.contact,
        type: {
          value: initialValues.permission?.type_name,
          label: initialValues.permission?.permission_name,
          id: initialValues.permission?.id,
        },
      }
      : defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  useEffect(() => {
    if (initialValues) {
      setValue('name', initialValues.name);
      setValue('email', initialValues.email);
      setValue('contact', initialValues.contact);
      setValue('type', {
        value: initialValues.permission?.type_name,
        label: initialValues.permission?.permission_name,
        id: initialValues.permission?.id,
      });
    }
  }, [initialValues, setValue]);

  if (meLoading || !permissionData) {
    return <Loader />;
  }

  const permissionOptions =
    getPermissionOptions(permissionType.DEALER).length > 0
      ? getPermissionOptions(permissionType.DEALER)
      : getPermissionOptions(permissionType.STAFF);

  const onSubmit = async ({
    name,
    email,
    password,
    contact,
    type,
  }: FormValues) => {
    const permissionPayload = {
      type_name: type?.value,
      permission_name: type?.label,
      ...(type?.id && { id: type.id }),
    };

    if (id) {
      const updatePayload = {
        name,
        email,
        contact,
        ...(password && password.trim() !== '' && { password }),
        permission: permissionPayload,
      };

      updateUser(
        { id: id as string, input: updatePayload },
        {
          onError: (error: any) => {
            const apiErrors = error?.response?.data?.errors || error?.response?.data;
            if (apiErrors) {
              Object.entries(apiErrors).forEach(([field, messages]) => {
                setError(field as keyof FormValues, {
                  type: 'manual',
                  message: (messages as string[])[0],
                });
              });
            } else {
              toast.error(t('common:update-failed'));
            }
          },
          onSuccess: () => {
            toast.success(t('common:successfully-updated'));
            router.push(Routes.user.list);
          },
        }
      );
    } else {
      registerUser(
        {
          name,
          email,
          password,
          contact,
          createdBy: currentUserId,
          permission: type?.value,
          shopSlug,
        },
        {
          onError: (error: any) => {
            const apiErrors = error?.response?.data;
            if (apiErrors) {
              Object.keys(apiErrors).forEach((field: string) => {
                setError(field as keyof FormValues, {
                  type: 'manual',
                  message: apiErrors[field][0],
                });
              });
            }
          },
        }
      );
    }
  };

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
            error={t(errors.name?.message || '')}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message || '')}
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message || '')}
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
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <Label className="mt-4">{t('form:input-label-type')}</Label>
                <Select
                  {...field}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  options={permissionOptions}
                  isClearable
                  isLoading={registering}
                  className="mb-4"
                />
              </>
            )}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>

        <Button loading={registering || updating} disabled={registering || updating}>
          {initialValues
            ? t('form:button-label-update-customer')
            : t('form:button-label-create-customer')}
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;
