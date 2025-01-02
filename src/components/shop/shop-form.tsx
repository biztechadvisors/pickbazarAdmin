import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import FileInput from '@/components/ui/file-input';
import TextArea from '@/components/ui/text-area';
import { shopValidationSchema } from './shop-validation-schema';
import { getFormattedImage } from '@/utils/get-formatted-image';
import { useCreateShopMutation, useUpdateShopMutation } from '@/data/shop';
import { useRouter } from 'next/router';
import {
  BalanceInput,
  ItemProps,
  ShopSettings,
  ShopSocialInput,
  User,
  UserAddressInput,
} from '@/types';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import Label from '@/components/ui/label';
import { getIcon } from '@/utils/get-icon';
import SelectInput from '@/components/ui/select-input';
import * as socialIcons from '@/components/icons/social';
import omit from 'lodash/omit';
import SwitchInput from '@/components/ui/switch-input';
import { getAuthCredentials } from '@/utils/auth-utils';
import { SUPER_ADMIN, Company, OWNER, E_COMMERCE, NON_E_COMMERCE } from '@/utils/constants';
import { useModalAction } from '../ui/modal/modal.context';
import OpenAIButton from '../openAI/openAI.button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSettingsQuery } from '@/data/settings';
import {
  useMeQuery,
  useUserQuery,
  useUsersQuery,
  useVendorQuery,
} from '@/data/user';
import ValidationError from '../ui/form-validation-error';
import { Routes } from '@/config/routes';
import LinkButton from '../ui/link-button';
import { usePermissionData } from '@/data/permission';
import Loader from '../ui/loader/loader';
import UserModal from '../ui/modal/user-modal';
import Modal from '../ui/modal/modal';
import CustomerCreateForm from '../user/user-form';
import CustForm from '../user/custForm';
import CreateCustomerPage from '@/pages/users/create';
import CreatePermission from '@/pages/permission/create';
import CreatePerm from '../createPerm';
import { useAtom } from 'jotai';
import { addPermission, selectedOption } from '@/utils/atoms';

export const chatbotAutoSuggestion = ({ name }: { name: string }) => {
  return [
    {
      id: 1,
      title: `Create a compelling description of ${name}, highlighting the unique products or services you offer.`,
    },
    {
      id: 2,
      title: `Craft an enticing ${name} shop description that captures the essence of your brand and its mission.`,
    },
    {
      id: 3,
      title: `Develop a concise and engaging overview of ${name}, showcasing its distinct offerings and benefits.`,
    },
    {
      id: 4,
      title: `Write a captivating shop description that intrigues customers and makes them eager to explore your products.`,
    },
    {
      id: 5,
      title: `Design a compelling narrative that tells the story of ${name}, connecting with customers on a personal level.`,
    },
    {
      id: 6,
      title: `Construct a persuasive shop description that emphasizes the value and quality customers can expect from your offerings.`,
    },
    {
      id: 7,
      title: `Shape a concise and memorable shop description that sets you apart from competitors and resonates with your target audience.`,
    },
    {
      id: 8,
      title: `Build an alluring shop description that conveys the unique experience customers will have when shopping with you.`,
    },
    {
      id: 9,
      title: `Create a description that showcases the passion, expertise, and attention to detail that define ${name} and its products.`,
    },
    {
      id: 10,
      title: `Craft an enticing shop overview that invites customers to embark on a journey of discovery through your carefully curated selection.`,
    },
  ];
};

const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex h-4 w-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  selectSearch: String;
  description: string;
  cover_image: any;
  logo: any;
  balance: BalanceInput;
  address: UserAddressInput;
  settings: ShopSettings;
};

type SelectUserProps = {
  control: Control<User>;
  errors: FieldErrors;
};

function SelectUser({ control, errors }: SelectUserProps) {
  const { t } = useTranslation();
  const { data } = useMeQuery();
  const usrById = data?.shop_id;
  const { permissions } = getAuthCredentials();
  const isOwner = permissions?.[0].includes(OWNER);
  const { data: users, isLoading } = useVendorQuery(data?.id);
  const options: any = users || [];
  const shouldDisable = control._defaultValues.owner != null || !isOwner;

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  console.log('users&&&&', users);

  return (
    <div className="mb-5 flex w-full justify-between gap-2">
      <div className="w-4/5">
        <SelectInput
          name="user"
          control={control}
          getOptionLabel={(option) => `${option.name} - ${option.email}`}
          getOptionValue={(option) => option}
          options={options.data}
          isLoading={isLoading}
          isSearchable={true}
          filterOption={(option, inputValue) => {
            const searchValue = inputValue.toLowerCase();
            return (
              option.name.toLowerCase().includes(searchValue) ||
              option.email.toLowerCase().includes(searchValue)
            );
          }}
          defaultValue={control._defaultValues.owner}
          disabled={shouldDisable}
        />
      </div>
      <div>
        <Button className="mb-5" onClick={openModal}>
          {t('form:form-title-create-user')}
        </Button>
      </div>
      <ValidationError message={t(errors.user?.message)} />
      <Modal open={isModalOpen} onClose={closeModal}>
        {/* <CustomerCreateForm /> */}
        <CustForm onSaveSuccess={closeModal}/>
      </Modal>
    </div>
  );
}

const ShopForm = ({ initialValues }: { initialValues?: any }) => {
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [permissionSelectedOption, setPermissionSelectedOption] =
    useAtom(selectedOption);
    const [additionalPerm, setAdditionalPerm] = useAtom(addPermission);
  const { permissions } = getAuthCredentials();
  const [selectedPermissions, setSelectedPermissions] = useState([]); 
  const [isChecked, setIsChecked] = useState(false);
  console.log("selectesPermission+++",selectedPermissions)


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  // const [permissionsss, setPermissionsss] = useState({}); 
  // useEffect(() => {
  //   fetch('/static/permission.json')
  //     .then((res) => res.json())
  //     .then((data) => setPermissionsss(data.Advance_Permission));
  // }, []);
  // const handlePermissionUpdate = (newPermission: string) => {
  //   if (newPermission) {
  //     setAdditionalPerm((prev) => [...prev, newPermission]);
  //   }
  //   closeModal();
  // };
  const handlePermissionUpdate = (newPermission: any) => {
    // Ensure newPermission is formatted correctly for the options
    console.log("first---", newPermission);
    const permissionWithLabel = {
      id: newPermission.id, 
      type_name: newPermission.type_name,
      permission_name: newPermission.permission_name,
    };
  const currentPermissions = getValues('additionalPermissions') || []; // Get current field value
  const updatedPermissions = [...currentPermissions, newPermission];

  setAdditionalPerm(updatedPermissions); // Update local state (optional)

  // Set value for the additionalPermissions field
  setValue('additionalPermissions', updatedPermissions);

  // Update the permission field (autofill)
  // setValue('permission', permissionWithLabel); // Update the default value with correctly formatted object
  };
  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal() {
    setIsOpen(false);
  }
 
  const permissionId = permissionSelectedOption?.e?.id;
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
        defaultValues: {
          ...initialValues,
          logo: getFormattedImage(initialValues.logo),
          cover_image: getFormattedImage(initialValues.cover_image),
          settings: {
            ...initialValues?.settings,
            socials: initialValues?.settings?.socials
              ? initialValues?.settings?.socials.map((social: any) => ({
                icon: updatedIcons?.find(
                  (icon) => icon?.value === social?.icon
                ),
                url: social?.url,
              }))
              : [],
          },
        },
      }
      : {}),
    resolver: yupResolver(shopValidationSchema),
  });
  const router = useRouter();
 
  // const { openModal } = useModalAction();
  const { locale } = router;
  const { data, isLoading: loading, isError } = useMeQuery();
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
 
  const generateName = watch('name');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestion({ name: generateName ?? '' });
  }, [generateName]);
 
  const userId = data?.id;
 
  const {
    isLoading: permissionLoading,
    error,
    data: permissionData,
  } = usePermissionData(userId);
 
  const filterdEcomm = permissionData?.filter((e: any) => {
    return e && e.type_name === Company;
  });
 
  // Separate permissions based on additionalPermission
  const additionalPermissionTrue = filterdEcomm?.filter((e: any) => {
    return e?.additionalPermission === false;
  });
 
  const additionalPermissionFalse = filterdEcomm?.filter((e: any) => {
    return e?.additionalPermission === true;
  });
 
  // Map options for each category
  const additionalPermissionOptions = additionalPermissionTrue?.map((e: any) => ({
    permission_name: e?.permission_name,
    type_name: e?.type_name,
    e,
  }));
 console.log("additionalPermissionOptions+++",additionalPermissionOptions)
  const permissionOptions = additionalPermissionFalse?.map((e: any) => ({
    permission_name: e?.permission_name,
    type_name: e?.type_name,
    e,
  }));
 
  const permissionProps = permissionSelectedOption?.e;
 
  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'description',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [generateName]);
 
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'settings.socials',
  });
 
  const handleSelectChange = (selectedOption: any) => {
    setPermissionSelectedOption(selectedOption);
  };
 
  async function onSubmit(values: FormValues) {
    console.log("Valuess",values)
    const settings = {
      ...values?.settings,
      location: { ...omit(values?.settings?.location, '__typename') },
      socials: values?.settings?.socials
        ? values?.settings?.socials?.map((social: any) => ({
          icon: social?.icon?.value,
          url: social?.url,
        }))
        : [],
    };
 
    // Remove companyType from values
    const { companyType, ...filteredValues } = values;
 console.log("filteredValues",filteredValues)
    try {
      if (initialValues) {
        const { ...restAddress } = filteredValues.address;
 
        await updateShop({
          id: initialValues.id,
          ...filteredValues,
          address: restAddress,
          settings,
          additionalPermissions: additionalPerm,
          balance: {
            id: initialValues.balance?.id,
            ...filteredValues.balance,
            // Ensure admin_commission_rate, current_balance, total_earnings, withdrawn_amount are updated when updating a shop
            admin_commission_rate: 0, // Example value
            current_balance: 0, // Example value
            total_earnings: 0, // Example value
            withdrawn_amount: 0, // Example value
          },
        });
      } else {
        const { ...restAddress } = filteredValues.address;
 
        await createShop({
          ...filteredValues,
          address: restAddress,
          settings,
          balance: {
            ...filteredValues.balance,
            // Pass these fields inside the balance object when creating a shop
            admin_commission_rate: 0, // Example value
            current_balance: 0, // Example value
            total_earnings: 0, // Example value
            withdrawn_amount: 0, // Example value
          },
          additionalPermissions: additionalPerm, // Ensure this is set as needed
          permission: permissionProps?.permission_name,
        });
      }
      // router.push('/shops'); // Navigate to the shops list or appropriate page
    } catch (error) {
      console.error('Error while saving the shop:', error);
    }
  }
 
  const coverImageInformation = (
    <span>
      {t('form:shop-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">1170 x 435{t('common:text-px')}</span>
    </span>
  );
 

  // Fixed the loading and error handling.
  if (permissionLoading || creating || updating) {
    return <Loader text="Loading..." />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(' initialValues_____________________', initialValues);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-comapny-type')}
            details={t('form:shop-company-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
       <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="relative mb-5">
              <Label>{t('form:input-label-select-company')}</Label>
              <SelectInput
                name="permission"
                placeholder="Select permissions"
                control={control}
                getOptionLabel={(option: any) => `${option.type_name} - ${option.permission_name}`}
                getOptionValue={(option: any) => option.id}
                options={additionalPermissionOptions}
                isSearchable={true}
                onChange={handleSelectChange}
                defaultValue={control._defaultValues?.additionalPermission}
              />
            </div>
 
            <div className="relative mb-5">
              <Label>{t('form:button-label-more-permission')}</Label>
              <SelectInput
                name="additionalPermissions"
                placeholder="Select additional permissions"
                control={control}
                getOptionLabel={(option: any) => `${option.type_name} - ${option.permission_name}`}
                getOptionValue={(option: any) => option.id}
                options={permissionOptions}
                isSearchable={true}
                onChange={handleSelectChange}
                defaultValue={control._defaultValues?.permission || watch('permission')}
                // defaultValue={watch('permission')} 
                // onAddPermission={handlePermissionUpdate}
              />
            </div>
             <div className="relative">
            
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="extraPermission"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="form-checkbox h-4 w-4 text-blue-600 mb-5"
        />
        <Label>{t('form:input-label-extra-permission')}</Label>
      </div>

      {/* Conditionally Render Button */}
      {isChecked && (
        <Button onClick={openModal}>
          {t('form:button-label-more-permission')}
        </Button>
      )}

      {/* Modal */}
      <Modal open={modalIsOpen} onClose={closeModal}>
        <CreatePerm
          PermissionDatas={permissionProps}
          selectedPermissions={selectedPermissions}
          setSelectedPermissions={setSelectedPermissions}
          permissionId={permissionId}
          onSaveSuccess={closeModal}
          onPermissionCreate={handlePermissionUpdate}
        />
      </Modal>
    </div>
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-logo')}
            details={t('form:shop-logo-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="logo" control={control} multiple={false} />
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:shop-cover-image-title')}
            details={coverImageInformation}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="cover_image" control={control} multiple={false} />
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:shop-basic-info')}
            details={t('form:shop-basic-info-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-name')}
              {...register('name')}
              variant="outline"
              className="mb-5"
              error={t(errors.name?.message!)}
            />
            {<SelectUser control={control} errors={errors} />}

            <div className="relative">
              {options?.useAi && (
                <OpenAIButton
                  title="Generate Description With AI"
                  onClick={handleGenerateDescription}
                />
              )}
              <TextArea
                label={t('form:input-label-description')}
                {...register('description')}
                variant="outline"
                error={t(errors.description?.message!)}
              />
            </div>
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:shop-payment-info')}
            details={t('form:payment-info-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-account-holder-name')}
              {...register('balance.payment_info.name')}
              variant="outline"
              className="mb-5"
              error={t(errors.balance?.payment_info?.name?.message!)}
            />
            <Input
              label={t('form:input-label-account-holder-email')}
              {...register('balance.payment_info.email')}
              variant="outline"
              className="mb-5"
              error={t(errors.balance?.payment_info?.email?.message!)}
            />
            <Input
              label={t('form:input-label-bank-name')}
              {...register('balance.payment_info.bank')}
              variant="outline"
              className="mb-5"
              error={t(errors.balance?.payment_info?.bank?.message!)}
            />
            <Input
              label={t('form:input-label-account-number')}
              {...register('balance.payment_info.account')}
              variant="outline"
              error={t(errors.balance?.payment_info?.account?.message!)}
            />
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:shop-address')}
            details={t('form:shop-address-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-country')}
              {...register('address.country')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.country?.message!)}
            />
            <Input
              label={t('form:input-label-city')}
              {...register('address.city')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.city?.message!)}
            />
            <Input
              label={t('form:input-label-state')}
              {...register('address.state')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.state?.message!)}
            />
            <Input
              label={t('form:input-label-zip')}
              {...register('address.zip')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.zip?.message!)}
            />
            <TextArea
              label={t('form:input-label-street-address')}
              {...register('address.street_address')}
              variant="outline"
              error={t(errors.address?.street_address?.message!)}
            />
          </Card>
        </div>

        {permissions?.includes(Company) ? (
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-notification-title')}
              details={t('form:form-notification-description')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
              <Input
                label={t('form:input-notification-email')}
                {...register('settings.notifications.email')}
                error={t(errors?.settings?.notifications?.email?.message!)}
                variant="outline"
                className="mb-5"
                disabled={permissions?.includes(SUPER_ADMIN)}
                type="email"
              />
              <div className="flex items-center gap-x-4">
                <SwitchInput
                  name="settings.notifications.enable"
                  control={control}
                  disabled={permissions?.includes(SUPER_ADMIN)}
                />
                <Label className="mb-0">
                  {t('form:input-enable-notification')}
                </Label>
              </div>
            </Card>
          </div>
        ) : (
          ''
        )}
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:shop-settings')}
            details={t('form:shop-settings-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-5">
              <Label>{t('form:input-label-autocomplete')}</Label>
              <Controller
                control={control}
                name="settings.location"
                render={({ field: { onChange } }) => (
                  <GooglePlacesAutocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onChange={onChange}
                    data={getValues('settings.location')!}
                  />
                )}
              />
            </div>
            <Input
              label={t('form:input-label-contact')}
              {...register('settings.contact')}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.contact?.message!)}
            />
            <Input
              label={t('form:input-label-website')}
              {...register('settings.website')}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.website?.message!)}
            />
            <div>
              {fields.map(
                (item: ShopSocialInput & { id: string }, index: number) => (
                  <div
                    className="border-b border-dashed border-border-200 py-5 first:mt-5 first:border-t last:border-b-0 md:py-8 md:first:mt-10"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                      <div className="sm:col-span-2">
                        <Label>{t('form:input-label-select-platform')}</Label>
                        <SelectInput
                          name={`settings.socials.${index}.icon` as const}
                          control={control}
                          options={updatedIcons}
                          isClearable={true}
                          defaultValue={item?.icon!}
                        />
                      </div>
                      <Input
                        className="sm:col-span-2"
                        label={t('form:input-label-url')}
                        variant="outline"
                        {...register(`settings.socials.${index}.url` as const)}
                        defaultValue={item.url!} // make sure to set up defaultValue
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <Button
              type="button"
              onClick={() => append({ icon: '', url: '' })}
              className="w-full sm:w-auto"
            >
              {t('form:button-label-add-social')}
            </Button>
          </Card>
        </div>

        <div className="mb-5 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t('form:button-label-update')
              : t('form:button-label-save')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ShopForm;