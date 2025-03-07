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
import { useMeQuery } from '@/data/user';
import PhoneInput from 'react-phone-input-2';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { usePermissionData } from '@/data/permission';
import { getAuthCredentials } from '@/utils/auth-utils';
import { AddStaffFormProps, PermissionItem, PermissionsProps, permissionType } from '@/types';
import Loader from '@/components/ui/loader/loader';
import CreatePermission from '@/pages/permission/create';
import useFormValues from '@/lib/hooks/use-form-values';

type FormValues = {
  name: string;
  email: string;
  password: string;
  contact: string;
  type: { value: string; label: string } | null;
  createdBy: string;
  numberOfDealers: number;
};
const defaultValues = {
  name: '',
  email: '',
  password: '',
  contact: '',
  type: null,
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

const AddStaffForm:React.FC<AddStaffFormProps> = ({defaultVal,defaultPermissions}) => {
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const { id } = meData || {};
  // const { data: permissionData,isLoading } = usePermissionData();
  const {isEqual,permissionData,permissionOptions:permissionOption,isLoading,permissionName,setPermissionName,permissionNameOptions} = useFormValues();
  // const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const { mutate: addStaff, isLoading: loading } = useAddStaffMutation();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const [defaultValue,setDefaultValue] = useState(defaultVal)
  const [defaultPermission,setDefaultPermission] = useState(defaultPermissions)

  const {
    query: { shop },
  } = router;
  const shopSlug =
    typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

  const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
    slug: shopSlug as string,
  });

  // let userId: any; 
  // if (meData?.permission.permission_name == "Owner") {
  //   userId = meData.id;
  // } else {
  //   userId = shopData?.owner_id;
  // } 
  let userId: string | number | undefined;
  const userRole = meData?.permission?.type_name;
  
  if (userRole === "Owner" || userRole === "Company") {
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
    resolver: yupResolver(staffFormSchema),
    mode:"onChange"
  });

  const permissionOptions = permissionOption(permissionType.STAFF)
  const defaultOption = permissionOptions?.find((option) => option.id === 186);

  useEffect(() => {
    if(permissionName)
      setValue("type",permissionNameOptions()[0])
  }, [permissionName,setValue])

  useEffect(() => {
    if (!control._formValues.type && defaultOption) {
      setValue("type", defaultOption);
    }
  }, [control._formValues.type, defaultOption, setValue]);

  if (isLoading) return <Loader/>

  function onSubmit(data) {
    console.log("form submitted",data);
    setPermissionName(null)

    // addStaff(
    //   {
    //     name,
    //     email,
    //     password,
    //     contact,
    //     permission: type?.value,
    //     numberOfDealers,
    //     managed_shop: shopData,
    //     shopSlug,
    //     createdBy: userId,
    //   },
    //   {
    //     onError: (error: any) => {
    //       Object.keys(error?.response?.data).forEach((field: any) => {
    //         setError(field, {
    //           type: 'manual',
    //           message: error?.response?.data[field],
    //         });
    //       });
    //     },
    //   }
    // );
  }

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
          {isEqual && <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <Label className="mt-4">{t('form:input-label-type')}</Label>
                <Select
                  {...field}
                  getOptionLabel={(option: { label: string }) => option.label}
                  getOptionValue={(option: { value: string }) => option.value}
                  // value={permissionOptions.find(option => option.id === 186)}
                  onChange={(value) => {
                    setValue("type", value);
                    setDefaultPermission(permissionData?.filter((permission:PermissionsProps) => permission.permission_name === value?.value)[0]?.permissions ??  [])
                  }}
                  // defaultValue={defaultValue}
                  options={permissionOptions}
                  isClearable={true}
                  isLoading={loading && isLoading}
                  className="mb-4"
                />
              </>
            )}
          />
          }
          <CreatePermission
            permissionType={permissionType.STAFF}
            defaultPermissions={defaultPermission}
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


// import React, { useEffect, useState } from 'react';
// import Button from '@/components/ui/button';
// import Input from '@/components/ui/input';
// import PasswordInput from '@/components/ui/password-input';
// import { Controller, useForm } from 'react-hook-form';
// import Card from '@/components/common/card';
// import Description from '@/components/ui/description';
// import { useRouter } from 'next/router';
// import { useTranslation } from 'next-i18next';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { useShopQuery } from '@/data/shop';
// import { useAddStaffMutation } from '@/data/staff';
// import { useMeQuery } from '@/data/user';
// import PhoneInput from 'react-phone-input-2';
// import Label from '../ui/label';
// import Select from '../ui/select/select';
// import { usePermissionData } from '@/data/permission';
// import { getAuthCredentials } from '@/utils/auth-utils';
// import { AddStaffFormProps, PermissionItem, PermissionsProps, permissionType } from '@/types';
// import Loader from '@/components/ui/loader/loader';
// import CreatePermission from '@/pages/permission/create';
// import useFormValues from '@/lib/hooks/use-form-values';

// type FormValues = {
//   name: string;
//   email: string;
//   password: string;
//   contact: string;
//   type: { value: string; label: string } | null;
//   createdBy: string;
//   numberOfDealers: number;
// };
// const defaultValues = {
//   name: '',
//   email: '',
//   password: '',
//   contact: '',
//   type: null,
//   numberOfDealers: 0, // Added default value for new field
// };

// const staffFormSchema = yup.object().shape({
//   name: yup.string().required('form:error-name-required'),
//   email: yup
//     .string()
//     .email('form:error-email-format')
//     .required('form:error-email-required'),
//   password: yup.string().required('form:error-password-required'),
//   contact: yup.string().required('form:error-contact-required'),
// });

// const AddStaffForm:React.FC<AddStaffFormProps> = ({defaultVal,defaultPermissions}) => {
//   const router = useRouter();
//   const { data: meData } = useMeQuery();
//   const { id } = meData || {};
//   // const { data: permissionData,isLoading } = usePermissionData();
//   const {isEqual,permissionData,permissionOptions:permissionOption,isLoading,permissionName,setPermissionName,permissionNameOptions} = useFormValues();
//   // const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
//   const { mutate: addStaff, isLoading: loading } = useAddStaffMutation();
//   const { t } = useTranslation();
//   const { permissions } = getAuthCredentials();
//   const [defaultValue,setDefaultValue] = useState(defaultVal)
//   const [defaultPermission,setDefaultPermission] = useState(defaultPermissions)

//   const {
//     query: { shop },
//   } = router;
//   const shopSlug =
//     typeof window !== 'undefined' ? localStorage.getItem('shopSlug') : null;

//   const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
//     slug: shopSlug as string,
//   });

//   // let userId: any; 
//   // if (meData?.permission.permission_name == "Owner") {
//   //   userId = meData.id;
//   // } else {
//   //   userId = shopData?.owner_id;
//   // } 
//   let userId: string | number | undefined;
//   const userRole = meData?.permission?.type_name;
  
//   if (userRole === "Owner" || userRole === "Company") {
//     userId = meData.id;
//   } else {
//     userId = shopData?.owner_id;
//   }
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     setError,
//     formState: { errors },
//     control,
//   } = useForm<FormValues>({
//     defaultValues,
//     resolver: yupResolver(staffFormSchema),
//     mode:"onChange"
//   });

//   const permissionOptions = permissionOption(permissionType.STAFF)
//   const defaultOption = permissionOptions?.find((option) => option.id === 186);

//   useEffect(() => {
//     if(permissionName)
//       setValue("type",permissionNameOptions()[0])
//   }, [permissionName,setValue])

//   function onSubmit({ name, email, password, contact, type, numberOfDealers }: FormValues) {
//     addStaff(
//       {
//         name,
//         email,
//         password,
//         contact,
//         permission: type?.value,
//         // numberOfDealers,
//         // managed_shop: shopData,
//         shopSlug,
//         createdBy: userId,
//       },
//       {
//         onError: (error: any) => {
//           Object.keys(error?.response?.data).forEach((field: any) => {
//             setError(field, {
//               type: 'manual',
//               message: error?.response?.data[field],
//             });
//           });
//         },
//       }
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} noValidate>
//       <div className="my-5 flex flex-wrap sm:my-8">
//         <Description
//           title={t('form:form-title-information')}
//           details={t('form:form-description-staff-info')}
//           className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//         />

//         <Card className="w-full sm:w-8/12 md:w-2/3">
//           <Input
//             label={t('form:input-label-name')}
//             {...register('name')}
//             type="text"
//             variant="outline"
//             className="mb-4"
//             error={t(errors.name?.message!)}
//           />
//           <Input
//             label={t('form:input-label-email')}
//             {...register('email')}
//             type="email"
//             variant="outline"
//             className="mb-4"
//             error={t(errors.email?.message!)}
//           />
//           <PasswordInput
//             label={t('form:input-label-password')}
//             {...register('password')}
//             error={t(errors.password?.message!)}
//             variant="outline"
//             className="mb-4"
//           />

//           <Controller
//             name="contact"
//             control={control}
//             render={({ field: { onChange, value } }) => (
//               <PhoneInput
//                 country="in"
//                 value={value}
//                 onChange={onChange}
//                 inputStyle={{
//                   width: '100%',
//                   height: '40px',
//                   border: '1px solid #e2e8f0',
//                   borderRadius: '0.375rem',
//                   padding: '0.5rem',
//                   fontSize: '0.875rem',
//                   outline: 'none',
//                   paddingLeft: '50px',
//                 }}
//               />
//             )}
//           />
//           {isEqual && <Controller
//             name="type"
//             control={control}
//             render={({ field }) => (
//               <>
//                 <Label className="mt-4">{t('form:input-label-type')}</Label>
//                 <Select
//                   {...field}
//                   getOptionLabel={(option: { label: string }) => option.label}
//                   getOptionValue={(option: { value: string }) => option.value}
//                   // value={permissionOptions.find(option => option.id === 186)}
//                   onChange={(value) => {
//                     setValue("type", value);
//                     setDefaultPermission(permissionData?.filter((permission:PermissionsProps) => permission.permission_name === value?.value)[0]?.permissions ??  [])
//                   }}
//                   // defaultValue={defaultValue}
//                   options={permissionOptions}
//                   isClearable={true}
//                   isLoading={loading && isLoading}
//                   className="mb-4"
//                 />
//               </>
//             )}
//           />
//           }
//           <CreatePermission
//             permissionType={permissionType.STAFF}
//             defaultPermissions={defaultPermission}
//           />
//         </Card>
//       </div>

//       <div className="mb-4 text-end">
//         <Button loading={loading} disabled={loading}>
//           {t('form:button-label-add-staff')}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AddStaffForm;
