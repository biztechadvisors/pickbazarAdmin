import React, { useEffect, useState } from 'react';
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
import { useMeQuery, useUserQuery, useUpdateUserMutation } from '@/data/user'; // Added useUserQuery
import PhoneInput from 'react-phone-input-2';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { usePermissionData } from '@/data/permission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { AddStaffFormProps, PermissionsProps, permissionType } from '@/types';
import Loader from '@/components/ui/loader/loader';
import CreatePermission from '@/pages/permission/create';
import useFormValues from '@/lib/hooks/use-form-values';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';

type FormValues = {
  name: string;
  email: string;
  password: string;
  contact: string;
  type: { value: string; label: string } | null;
  createdBy: string;
};

const defaultValues = {
  name: '',
  email: '',
  password: '',
  contact: '',
  type: null,
};

const staffFormSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().when('$isEditMode', {
    is: false,
    then: yup.string().required('form:error-password-required'),
    otherwise: yup.string(),
  }),
  contact: yup.string().required('form:error-contact-required'),
  type: yup
    .object()
    .shape({
      value: yup.string().required('form:error-type-required'),
      label: yup.string().required('form:error-type-required'),
    })
    .nullable()
    .required('form:error-type-required'),
});

const AddStaffForm: React.FC<AddStaffFormProps> = ({
  defaultVal,
  defaultPermissions,
  initialValues // Added initialValues prop
}) => {
  const router = useRouter();
  const { query } = router;
  const isEditMode = !!query.id; // Check if we're in edit mode
  const { data: meData } = useMeQuery();
  const { id } = meData || {};
  const {
    isEqual,
    permissionData,
    permissionOptions: permissionOption,
    isLoading,
    permissionName,
    setPermissionName,
    permissionNameOptions
  } = useFormValues();

  const { mutate: addStaff, isLoading: loading } = useAddStaffMutation();
  const { mutate: updateUser, isLoading: updating } = useUpdateUserMutation();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const [defaultPermission, setDefaultPermission] = useState(defaultPermissions);
  const [permissionOptions, setPermissionOptions] = useState(permissionOption(permissionType.STAFF));
  const [selectedPermission, setSelectedPermission] = useState<any>(null);


  // Fetch user data if in edit mode
  const { data: userData, isLoading: loadingUser } = useUserQuery(
    { id: query.id as string },
    { enabled: isEditMode }
  );

  const shopSlug =
    typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

  const { data: shopData } = useShopQuery({
    slug: shopSlug as string,
  });

  let userId: string | number | undefined;
  const userRole = meData?.permission?.type_name;

  if (userRole === "Owner" || userRole === "Company" || userRole === "Dealer") {
    userId = meData.id;
  } else {
    userId = shopData?.owner_id;
  }

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<FormValues>({
    defaultValues: initialValues ? {
      name: initialValues.name,
      email: initialValues.email,
      contact: initialValues.contact || '',
      type: initialValues.permission?.permission_name
        ? { value: initialValues.permission.permission_name, label: initialValues.permission.permission_name }
        : null,
    } : defaultValues,
    resolver: yupResolver(staffFormSchema),
    context: { isEditMode },
    mode: "onChange"
  });;
  const contactValue = watch('contact');
  // Set initial values when in edit mode
  useEffect(() => {
    if (isEditMode && (initialValues || userData)) {
      const data = initialValues || userData;
      console.log('Initial data for form:', data);
      const formValues = {
        name: data.name,
        email: data.email,
        contact: data.contact || data.contact || '',
        type: data.permission?.permission_name
          ? { value: data.permission.permission_name, label: data.permission.permission_name }
          : null,
      };

      console.log('Setting form values:', formValues);
      reset(formValues);

      // Explicitly set contact value to ensure it's captured
      setValue('contact', formValues.contact, { shouldValidate: true });
    }
  }, [isEditMode, initialValues, userData, reset, setValue]);

  const isOwner = permissions?.includes('Owner');
  const isCompany = permissions?.includes('Company');
  const isDealer = permissions?.includes('Dealer');

  useEffect(() => {
    if ((isOwner || isCompany || isDealer) && permissionOptions) {
      if (isOwner) {
        const ownerStaffPermission = permissionData?.find(
          (permission: PermissionsProps) => permission.type_name === 'Staff' && permission.user === userId
        );
        if (ownerStaffPermission && !isEditMode) {
          setValue('type', {
            value: ownerStaffPermission.permission_name,
            label: ownerStaffPermission.permission_name
          });
          setDefaultPermission(ownerStaffPermission.permissions ?? []);
        }
      }

      if (isCompany) {
        const companyStaffPermission = permissionData?.find(
          (permission: PermissionsProps) => permission.type_name === 'Staff' && permission.user === userId
        );
        if (companyStaffPermission && !isEditMode) {
          setValue('type', {
            value: companyStaffPermission.permission_name,
            label: companyStaffPermission.permission_name
          });
          setDefaultPermission(companyStaffPermission.permissions ?? []);
        }
      }

      if (isDealer) {
        const dealerStaffPermission = permissionData?.find(
          (permission: PermissionsProps) => permission.type_name === 'Staff' && permission.user === userId
        );
        if (dealerStaffPermission && !isEditMode) {
          setValue('type', {
            value: dealerStaffPermission.permission_name,
            label: dealerStaffPermission.permission_name
          });
          setDefaultPermission(dealerStaffPermission.permissions ?? []);
        }
      }
    }
  }, [isOwner, isCompany, isDealer, permissionOptions, permissionData, setValue, userId, isEditMode]);



  const handlePermissionCreated = (newPermission: any) => {
    const newPermissionOption = { value: newPermission.id, label: newPermission.permission_name };
    console.log("HandlePermissionCreates%%%%%", newPermissionOption)
    setSelectedPermission(newPermissionOption);
    setValue("type", newPermissionOption, { shouldValidate: true });
    setPermissionOptions((prevOptions) => [...prevOptions, newPermissionOption]);
  };

  useEffect(() => {
    if (selectedPermission) {
      setValue('type', selectedPermission, { shouldValidate: true });
    }
  }, [selectedPermission, setValue]);

  const getPermissionsForSelectedType = (permission) => {
    const permData = permissionData?.find(
      (p) => p.permission_name === permission.value
    );
    return permData?.permissions || [];
  };

  const handlePermissionSelection = (value) => {
    setSelectedPermission(value);
    const permissions = getPermissionsForSelectedType(value);
    setDefaultPermission(permissions);
    setValue('type', value, { shouldValidate: true });
  };

  function onSubmit({ name, email, password, contact, type }: FormValues) {
    const permissionToSubmit = selectedPermission || type;

    if (isEditMode) {
      const updatePayload = {
        name,
        email,
        ...(password && { password }),

        contact, // This updates the contact in profile

        permission: {
          id: permissionToSubmit?.id || initialValues?.permission?.id,
          type_name: permissionToSubmit?.value || permissionToSubmit?.label,
          permission_name: permissionToSubmit?.value || permissionToSubmit?.label,
        },
        shopSlug,
      };

      console.log('Final Update Payload:', JSON.stringify(updatePayload, null, 2));

      updateUser(
        {
          id: query.id as string,
          input: updatePayload
        },
        {
          onError: (error) => {
            console.error('Update error:', error.response?.data);
            toast.error('Failed to update staff');
          },
          onSuccess: () => {
            toast.success('Staff updated successfully');
            router.push(Routes.staff.list);
          }
        }
      );
    } else {
      // Create operation remains the same
      addStaff({
        name,
        email,
        password,
        contact,
        permission: permissionToSubmit?.label,
        shopSlug,
        createdBy: userId,
      });
    }
  }
  if (loadingUser) return <Loader />;

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

          {!isEditMode && (
            <PasswordInput
              label={t('form:input-label-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-4"
            />
          )}

          <Controller
            name="contact"
            control={control}
            defaultValue={initialValues?.contact || initialValues?.contact || ''}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country="in"
                value={value}
                onChange={(phone) => {
                  console.log('Phone input changed:', phone);
                  onChange(phone);
                }}
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
            defaultValue={initialValues?.permission?.permission_name
              ? { value: initialValues.permission.permission_name, label: initialValues.permission.permission_name }
              : null}
            render={({ field }) => (
              <>
                <Label className="mt-4">{t("Permission Name")}</Label>
                <Select
                  {...field}
                  value={field.value}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  onChange={(value) => {
                    setSelectedPermission(value);
                    field.onChange(value);
                  }}
                  required
                  options={permissionOptions}
                  isClearable={true}
                  isLoading={loading || isLoading}
                  className="mb-4"
                />
              </>
            )}
          />

          <CreatePermission
            permissionType={permissionType.STAFF}
            defaultPermissions={selectedPermission ? getPermissionsForSelectedType(selectedPermission) : defaultPermission}
            onPermissionCreated={handlePermissionCreated}
            selectedPermission={selectedPermission}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading || updating} disabled={loading || updating}>
          {isEditMode ? t('form:button-label-update') : t('form:button-label-add-staff')}
        </Button>
      </div>
    </form>
  );
};

export default AddStaffForm;