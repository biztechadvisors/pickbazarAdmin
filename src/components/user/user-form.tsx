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
import { Permission, User } from '@/types';
import Select from '../ui/select/select';
import Label from '../ui/label';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';
import Cookies from 'js-cookie';


type FormValues = {
  name: string;
  email: string;
  password: string;
  type: { value: string };
  permission: Permission;
  data: any
  type_name: any

};

const defaultValues = {
  email: '',
  password: '',
};

const CustomerCreateForm = () => {
  const { t } = useTranslation();
  const { data } = useMeQuery();
  // const [typeName] = useAtom(newPermission); 
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
console.log('newdata',data)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  // enum UserType {
  //   'Admin',
  //   'Dealer',
  //   'Vendor',
  //   'Customer',
  // }

  const UserType = ['Admin', 'Dealer', 'Vendor', 'Customer']

  const userTypes = UserType.map((value) => ({ value }));

  async function onSubmit({ name, email, password, type }: FormValues) {
    registerUser(
      {
        name,
        email,
        password,
        type: type.value,
        permission: Permission.StoreOwner,
        UsrBy:data?.id
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
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
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
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
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <Label>{t('form:input-label-type')}</Label>
                <Select
                  {...field}
                  getOptionLabel={(option: any) => option.value}
                  getOptionValue={(option: any) => option.value}
                  options={userTypes}
                  isClearable={true}
                  isLoading={loading}
                  className="mb-4"
                />
              </>
            )}
          />
        </Card >
      </div >

      <div className="text-end mb-4">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-create-customer')}
        </Button>
      </div>
    </form >
  );
};

export default CustomerCreateForm;
