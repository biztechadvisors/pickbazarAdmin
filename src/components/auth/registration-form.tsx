import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterMutation } from '@/data/user';
import { Permission } from '@/types';
import { setAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import Link from '@/components/ui/link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  checkboxLabel: {
    fontSize: 8,
    fontWeight: 'lighter',
  },
});

const registrationFormSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup.string().email('form:error-email-format').required('form:error-email-required'),
  phone: yup.string().required('form:error-phone-required'),
  permission: yup.string().default('store_owner').oneOf(['store_owner']),
  shopName: yup.string(),
  occupation: yup.string(),
  space: yup.string(),
  fund: yup.string()
});

const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(registrationFormSchema),
    defaultValues: {
      permission: Permission.StoreOwner,
    },
  });
  const { t } = useTranslation();

  async function onSubmit({ name, email, phone, permission, shopName, occupation, space, fund }: any) {
    registerUser({
      name,
      email,
      phone,
      permission,
      shopName,
      occupation,
      space,
      fund
    }, {
      onSuccess: (data: any) => {
        if (data?.token) {
          setAuthCredentials(data?.token, data?.permissions);
          window.location.href = Routes.dashboard;
        } else {
          setErrorMessage('form:error-credential-wrong');
        }
      },
      onError: (error: any) => {
        Object.keys(error?.response?.data).forEach((field: any) => {
          setError(field, {
            type: 'manual',
            message: error?.response?.data[field],
          });
        });
      },
    });
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t('form:input-label-name')}
          {...register('name')}
          variant="outline"
          className="mb-4"
          error={t(errors?.name?.message!)}
        />
        <Input
          label={t('form:input-label-email')}
          {...register('email')}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <Input
          label={t('form:input-label-phone')}
          {...register('phone')}
          type="tel"
          variant="outline"
          className="mb-4"
          error={t(errors?.phone?.message!)}
        />
        <FormControl component="fieldset" className='checkboxLabel'>
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            aria-label="type"
            name="type"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <FormControlLabel 
              value="Shop Owner"
              control={<Radio />}
              label="Shop Owner"
            />
            <FormControlLabel 
              value="Dealer"
              control={<Radio />}
              label="Dealer"
            />
          </RadioGroup>
        </FormControl>

        {selectedType === 'Shop Owner' && (
          <>
            <Input
              label={('Shop Name')}
              {...register('shopName')}
              variant="outline"
              className="mb-4"
              error={t(errors?.shopName?.message!)}
            />
            <Input
              label={t('occupation')}
              {...register('occupation')}
              variant="outline"
              className="mb-4"
              error={t(errors?.occupation?.message!)}
            />
          </>
        )}

        {selectedType === 'Dealer' && (
          <>
            <Input
              label={t('space')}
              {...register('space')}
              variant="outline"
              className="mb-4"
              error={t(errors?.space?.message!)}
            />
            <Input
              label={t('occupation')}
              {...register('occupation')}
              variant="outline"
              className="mb-4"
              error={t(errors?.occupation?.message!)}
            />
            <Input
              label={t('Fund')}
              {...register('fund')}
              variant="outline"
              className="mb-4"
              error={t(errors?.fund?.message!)}
            />
          </>
        )}

        <Button className="w-full" loading={loading} disabled={loading}>
          {t('form:text-register')}
        </Button>

        {errorMessage && (
          <Alert
            message={t(errorMessage)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMessage(null)}
          />
        )}
      </form>
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2">
          {t('common:text-or')}
        </span>
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {t('form:text-already-account')}{' '}
        <Link
          href={Routes.login}
          className="ms-1 font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t('form:button-label-login')}
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
