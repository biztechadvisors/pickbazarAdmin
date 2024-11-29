import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { Controller, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useShopQuery } from '@/data/shop';
import { useAddStaffMutation } from '@/data/staff';
import { useMeQuery, useRegisterMutation } from '@/data/user';
import PhoneInput from 'react-phone-input-2';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { usePermissionData } from '@/data/permission';
import { getAuthCredentials } from '@/utils/auth-utils';


type FormValues = {
  name: string;
  email: string;
  password: string;
  contact: string;
  type: { value: string; label: string };
  createdBy: string;
  numberOfDealers: number;
};
const defaultValues = {
  name: '',
  email: '',
  password: '',
  contact: '',
  type: { value: '', label: '' },
  numberOfDealers: 0, // Added default value for new field
};

const staffFormSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
  contact: yup.string().required('form:error-contact-required'),
});

const AddStaffForm = () => {
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const { id } = meData || {};
  const { data: permissionData } = usePermissionData(id);
  // const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const { mutate: addStaff, isLoading: loading } = useAddStaffMutation();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  console.log("permissionData-staff", permissionData)

  const {
    query: { shop },
  } = router;
  const shopSlug =
  typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
  slug: shopSlug as string,
});
  // const shopId = shopData?.id!;
  console.log("shopSlug&&",shopSlug)
  // console.log("shopId",shopId)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(staffFormSchema),
  });
 

  const permissionOptions =
    permissionData?.map((permission: { id: any; permission_name: string }) => ({
      value: permission.permission_name,
      label: permission.permission_name,
      id: permission.id,
    })) ?? [];


    console.log("permissionOptions- staff",permissionOptions)

  function onSubmit({ name, email, password ,contact,type,numberOfDealers}: FormValues) {
    addStaff(
      {
        name,
        email,
        password,
        contact,
        permission: type?.value,
        numberOfDealers,
        managed_shop: shopData,
        // slug: "hilltop-marble",
        shopSlug, 
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: 'manual',
              message: error?.response?.data[field],
            });
          });
        },
      }
    );
  }

  const { data } = useMeQuery();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:form-description-staff-info')}
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
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-add-staff')}
        </Button>
      </div>
    </form>
  );
};

export default AddStaffForm;
