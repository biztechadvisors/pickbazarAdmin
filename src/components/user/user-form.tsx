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
import { Permission } from '@/types';
import Select from '../ui/select/select';
import Label from '../ui/label';
import { useRouter } from 'next/router';
import { usePermissionData } from '@/data/permission';
import { getAuthCredentials } from '@/utils/auth-utils';
import Loader from '../ui/loader/loader';

type FormValues = {
  name: string;
  email: string;
  password: string;
  contact: string;
  type: { value: string };
  permission: Permission;
  UsrBy: string;
};

const defaultValues = {
  email: '',
  password: '',
  contact: '',
};

const CustomerCreateForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const { id } = meData || {};
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

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

  const {data:me,isLoading} = useMeQuery()
  const userId:any = me?.id

  const{ data:permissionData}= usePermissionData(userId);
  const { permissions } = getAuthCredentials();

  console.log("permissionData", permissionData)
  const permissionNames =
    permissionData?.data?.map(
      (permission: { permission_name: any }) => permission.permission_name
    ) ?? [];
  var permissionOptions: any;
  if (permissions[0] !== 'dealer') {
    permissionOptions = [
      ...permissionNames.map((name: any) => ({
        value: name,
        label: name,
      })),
    ];
  } else {
    permissionOptions = [
      { value: 'customer', label: 'customer' },
      { value: 'staff', label: 'staff' },
    ];
  }

  async function onSubmit({
    name,
    email,
    password,
    contact,
    type,
  }: FormValues) {
    registerUser(
      {
        name,
        email,
        password,
        contact,
        UsrBy: id,
        type: type?.value,
        // permission: Permission.StoreOwner,
        // UsrBy: id,
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

  // console.log("Permission.StoreOwner", Permission.StoreOwner)

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
          <Input
            label={t('form:input-label-contact')}
            {...register('contact')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.contact?.message!)}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <Label>{t('form:input-label-type')}</Label>
                <Select
                  {...field}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  options={permissionOptions}
                  isClearable={true}
                  isLoading={loading}
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

// Json which require to send while registering.

// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "password123",
//   "type": "user",
//   "UsrBy": "Admin",
//   "contact": "1234567890",
//   "permission": {
//   },
//   "isVerified": false
// }
