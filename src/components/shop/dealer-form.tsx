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
import { useMeQuery, useRegisterMutation } from '@/data/user'; // Import useRegisterMutation
import PhoneInput from 'react-phone-input-2';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { getAuthCredentials } from '@/utils/auth-utils';
import { AddDealerFormProps, PermissionsProps, permissionType } from '@/types';
import Loader from '@/components/ui/loader/loader';
import CreatePermission from '@/pages/permission/create';
import useFormValues from '@/lib/hooks/use-form-values';
import { DEALER } from '@/utils/constants';

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

const dealerFormSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
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

const DealerAddForm: React.FC<AddDealerFormProps> = ({ defaultVal, defaultPermissions }) => {
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const { id } = meData || {};
  const { isEqual, permissionData, permissionOptions: permissionOption, isLoading, permissionName, setPermissionName, permissionNameOptions } = useFormValues();
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation(); // Use useRegisterMutation
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const [defaultPermission, setDefaultPermission] = useState(defaultPermissions);
  const [permissionOptions, setPermissionOptions] = useState(permissionOption(permissionType.DEALER));

  const {
    query: { shop },
  } = router;
  const shopSlug =
    typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

  const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
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
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(dealerFormSchema),
    mode: "onChange"
  });

  const isCompany = permissions?.includes('Company');

  // Restrict access to Company users only
  useEffect(() => {
    if (!isCompany) {
      router.replace(Routes.dashboard); // Redirect non-Company users
    }
  }, [isCompany, router]);

  useEffect(() => {
    if (isCompany && permissionOptions) { // Only for Company users
      const dealerPermission = permissionData?.find(
        (permission: PermissionsProps) => permission.type_name === DEALER && permission.user === userId
      );
      if (dealerPermission) {
        // Use permission_name instead of type_name
        setValue('type', { value: dealerPermission.permission_name, label: dealerPermission.permission_name });
        setDefaultPermission(dealerPermission.permissions ?? []);
      }
    }
  }, [isCompany, permissionOptions, permissionData, setValue, userId]);

  const [selectedPermission, setSelectedPermission] = useState<any>(null);

  const handlePermissionCreated = (newPermission: any) => {
    const newPermissionOption = { value: newPermission.id, label: newPermission.permission_name };
    setSelectedPermission(newPermissionOption); // Update selected permission
    setValue("type", newPermissionOption, { shouldValidate: true }); // Update form field

    // Update the permission options list
    setPermissionOptions((prevOptions) => {
      const updatedOptions = [...prevOptions, newPermissionOption];
      return updatedOptions;
    });
  };

  // Sync selectedPermission with form
  useEffect(() => {
    if (selectedPermission) {
      setValue('type', selectedPermission, { shouldValidate: true });
    }


  }, [selectedPermission, setValue]);

  function onSubmit({ name, email, password, contact, type }: FormValues) {
    const permissionToSubmit = selectedPermission || type;

    if (isCompany) {
      // For Company users, filter only Dealer-specific permissions
      const dealerPermissions = permissionData?.filter(
        (permission: PermissionsProps) => permission.type_name === DEALER
      );
      // permissionToSubmit = dealerPermissions?.[0] || type; // Use the first Dealer-specific permission
    }

    registerUser(
      {
        name,
        email,
        password,
        contact,
        createdBy: userId,
        permission: permissionToSubmit?.label, // Use the value instead of label
        shopSlug,
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: error?.response?.data[field],
            });
          });
        },
      }
    );
  }

  const getPermissionsForSelectedType = (permission) => {
    const permData = permissionData?.find(
      (p) => p.permission_name === permission.value
    );
    return permData?.permissions || [];
  };

  const [dataFromChild, setDataFromChild] = useState('');

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('Add your dealer information and create a new dealer from here')}
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

          {!dataFromChild ?
            <Controller
              name="type"
              control={control}
              defaultValue={selectedPermission ?? null} // Ensure default value is selectedPermission
              render={({ field }) => {
                return (
                  <>
                    <Label className="mt-4">{t("form:input-label-permission-name")}</Label>
                    <Select
                      {...field}
                      value={selectedPermission || field.value} // Prioritize selectedPermission
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      onChange={(value) => {
                        setSelectedPermission(value); // Update selected permission
                        setValue("type", value, { shouldValidate: true });
                      }}
                      required
                      options={permissionOptions}
                      isClearable={true}
                      isLoading={loading && isLoading}
                      className="mb-4"
                    />
                  </>
                );
              }}
            />
            :
            <Input
              label={t('form:input-label-type')}
              variant="outline"
              className="mb-4 mt-4"
              defaultValue={DEALER}
              readOnly
              error={t(errors.email?.message!)}
            />
          }

          <CreatePermission
            permissionType={permissionType.DEALER}
            defaultPermissions={selectedPermission ? getPermissionsForSelectedType(selectedPermission) : defaultPermission}
            onPermissionCreated={handlePermissionCreated}
            selectedPermission={selectedPermission}
            onData={handleDataFromChild}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-add-dealerlist')} {/* Update the button label */}
        </Button>
      </div>
    </form>
  );
};

export default DealerAddForm;