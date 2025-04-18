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
import * as socialIcons from '@/components/icons/social';
import SelectInput from '@/components/ui/select-input';
import omit from 'lodash/omit';
import SwitchInput from '@/components/ui/switch-input';
import { getAuthCredentials } from '@/utils/auth-utils';
import {
  SUPER_ADMIN,
  Company,
  OWNER,
  E_COMMERCE,
  NON_E_COMMERCE,
  STAFF,
} from '@/utils/constants';
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
import { addPermission, selectedOption, setUsrEmailState } from '@/utils/atoms';
import ErrorMessage from '../ui/error-message';
import Select from '../ui/select/select';

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
  { value: 'FacebookIcon', label: 'Facebook' },
  { value: 'InstagramIcon', label: 'Instagram' },
  { value: 'TwitterIcon', label: 'Twitter' },
  { value: 'YouTubeIcon', label: 'Youtube' },
];

export const updatedIcons = socialIcon.map((item) => ({
  value: item.value,
  name: item.label, // used for getOptionLabel fallback if needed
  label: (
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
  ),
}));

type FormValues = {
  name: string;
  selectSearch: String;
  description: string;
  cover_image: any;
  logo: any;
  dealerCount: Number;
  balance: BalanceInput;
  address: UserAddressInput;
  settings: ShopSettings;
  permission: any;
  additionalPermissions: any[];
  user: any;
};

const ShopForm = ({ initialValues }: { initialValues?: any }) => {

  const [createdUser, setCreatedUser] = useState<any>(null); // State to store the created user
  const [modalIsOpen, setIsOpen] = useState(false);
  const [permissionSelectedOption, setPermissionSelectedOption] =
    useAtom(selectedOption);
  const [additionalPerm, setAdditionalPerm] = useAtom(addPermission);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [optionsUser, setUserOptions] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewPermissionModalOpen, setViewPermissionModalOpen] = useState(false);
  const [viewPermissionData, setViewPermissionData] = useState<any>(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handlePermissionUpdate = (newPermission: any) => {

    const currentPermissions = getValues('additionalPermissions') || []; // Get current field value
    const updatedPermissions = [...currentPermissions, newPermission];

    setAdditionalPerm(updatedPermissions); // Update local state (optional)

    // Set value for the additionalPermissions field
    setValue('additionalPermissions', updatedPermissions);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openViewPermissionModal(permissionData: any) {    
    setViewPermissionData(permissionData);
    setViewPermissionModalOpen(true);
  }

  function closeViewPermissionModal() {
    setViewPermissionModalOpen(false);
    setViewPermissionData(null);
  }

  const permissionId = permissionSelectedOption?.e?.id;

  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();

  const { permissions } = getAuthCredentials();
  const { data: meData, isLoading: meLoading, error: meError } = useMeQuery();
  const { data: users, isLoading } = useVendorQuery(meData?.id, {
    enabled: !!meData?.id,
  });
  // const { openModal } = useModalAction();

  const { data, isLoading: loading, isError } = useMeQuery();

  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const createdById = meData?.createdBy?.id; // Get the createdBy user ID

  // Fetch the createdBy user's data
  const { data: createdByUser, isLoading: createdByLoading, error: createdByError } = useUserQuery(
    { id: createdById },
    { enabled: !!createdById }
  );
  const userId = data?.id;

  const {
    isLoading: permissionLoading,
    error,
    data: permissionData,
  } = usePermissionData({
    search: Company,
    type: Company,
    page: 1,
    limit: 20,
  });

  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'settings.socials',
  });

  const generateName = watch('name');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  const filterdEcomm = permissionData?.filter((e: any) => {
    return e && e.type_name === Company;
  });

  // Separate permissions based on additionalPermission
  const additionalPermissionTrue = filterdEcomm?.filter((e: any) => {
    return e?.additionalPermission === true;
  });

  const additionalPermissionFalse = filterdEcomm?.filter((e: any) => {
    return e?.additionalPermission === false;
  });

  // Map options for each category
  const additionalPermissionOptions = additionalPermissionTrue?.map(
    (e: any) => ({
      permission_name: e?.permission_name,
      type_name: e?.type_name,
      e,
    })
  );
  const permissionOptions = useMemo(() => additionalPermissionFalse?.map((e: any) => ({
    permission_name: e?.permission_name,
    type_name: e?.type_name,
    view: (
      <button
        className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={(event) => {
          event.stopPropagation();
          openViewPermissionModal(e);
        }}
      >
        View
      </button>
    ),
    e,
  })), [additionalPermissionFalse]);

  const permissionProps = permissionSelectedOption?.e;

  const handleSelectChange = (selectedOption: any) => {
    setPermissionSelectedOption(selectedOption);
  };

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'description',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [generateName]);


  // Initial value of the watch field
  const currentSelectedUser = watch ? watch('user') : selectedUser;

  // Set initial options from fetched data
  useEffect(() => {
    if (users?.data) {
      setUserOptions(users.data);
    }
  }, [users?.data]);

  // If there's a created user, add it to the options and select it
  useEffect(() => {
    if (
      createdUser &&
      !optionsUser.some((option) => option.id === createdUser.id)
    ) {
      setUserOptions((prevOptions) => [...prevOptions, createdUser]);
      setSelectedUser(createdUser);
      setValue && setValue('user', createdUser, { shouldValidate: true });
    }
  }, [createdUser, optionsUser, setValue]);

  // Sync selected user to `watch` when it changes
  useEffect(() => {
    if (currentSelectedUser && setValue) {
      setSelectedUser(currentSelectedUser); // Update local state to reflect form value
    }
  }, [currentSelectedUser, setValue]);

  // Determine if the staff member is created by an owner
  const createdByRole = createdByUser?.permission?.type_name;
  const isCreatedByOwner = createdByRole === OWNER;

  // Check if the user is an owner
  const isOwner = permissions?.includes(OWNER) || // Owners can write
    (permissions?.includes(STAFF) && isCreatedByOwner);

  // Determine if the action should be disabled
  const shouldDisable = !isOwner;

  // Handle the newly created user
  const handleUserCreated = (newUser: any) => {
    if (!newUser || !newUser.id) return; // Defensive check

    // Add new user to options if it doesn't already exist
    if (!optionsUser.some((option) => option.id === newUser.id)) {
      setUserOptions((prevOptions) => [...prevOptions, newUser]);
    }

    // Automatically select the newly created user and set form value
    if (setValue) {
      setValue('user', newUser, { shouldValidate: true }); // Update form control value
    }

    setSelectedUser(newUser); // Update local selectedUser state
    setCreatedUser(newUser); // Ensure createdUser state is updated
    closeUserModal();
  };

  const closeUserModal = () => setUserModalOpen(false);

  const openUserModal = () => setUserModalOpen(true);

  const handleUserChange = (selectedOption: any) => {
    if (setValue) {
      setValue('user', selectedOption, { shouldValidate: true });
      setSelectedUser(selectedOption);
    }
  };

  if (error) {
    return <div>{t('error:failed-to-fetch-users')}</div>; // Handle query errors
  }

  // Create-User-End ---------------------------------

  const formattedPermissions = additionalPerm?.map((perm) => perm.permission_name) || [];

  async function onSubmit(values: FormValues) {

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
    try {
      if (initialValues) {
        const { ...restAddress } = filteredValues.address;

        await updateShop({
          id: initialValues.id,
          ...filteredValues,
          address: restAddress,
          settings,
          additionalPermissions: formattedPermissions.length > 0 ? formattedPermissions : [values.additionalPermissions.permission_name].length > 0 ? [values.additionalPermissions.permission_name] : [initialValues.additionalPermissions[0].permission_name],
          permission: values.permission ? values.permission?.permission_name : initialValues.permission.permission_name,
          owner: values.owner ?? initialValues.owner,
          cover_image: values.cover_image ?? initialValues.cover_image,
          balance: {
            id: initialValues.balance?.id,
            ...filteredValues?.balance,
            admin_commission_rate: initialValues?.balance?.admin_commission_rate ?? 0, // Example value
            current_balance: initialValues?.balance?.current_balance ?? 0, // Example value
            total_earnings: initialValues?.balance?.total_earnings ?? 0, // Example value
            withdrawn_amount: initialValues?.balance?.withdrawn_amount ?? 0, // Example value
          },
          dealerCount: values.dealerCount ?? initialValues.dealerCount,
        });
      } else {
        const { ...restAddress } = filteredValues.address;

        await createShop({
          ...filteredValues,
          address: restAddress,
          settings,
          dealerCount: values.dealerCount ?? 0,
          balance: {
            ...filteredValues.balance,
            // Pass these fields inside the balance object when creating a shop
            admin_commission_rate: 0, // Example value
            current_balance: 0, // Example value
            total_earnings: 0, // Example value
            withdrawn_amount: 0, // Example value
          },
          additionalPermissions: formattedPermissions ? formattedPermissions : [values.additionalPermissions.permission_name],
          permission: values.permission?.permission_name,
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            {!shouldDisable &&
              <div className="mb-5 flex w-full justify-between gap-2">
                <div className="w-4/5">
                  <SelectInput
                    name="user"
                    control={control}
                    getOptionLabel={(option) =>
                      `${option?.name || ''} - ${option?.email || ''}`
                    }
                    getOptionValue={(option) => option?.id}
                    options={optionsUser}
                    isLoading={isLoading}
                    isSearchable
                    value={
                      selectedUser ||
                      currentSelectedUser ||
                      (initialValues?.owner
                        ? {
                          id: initialValues.owner.id,
                          name: initialValues.owner.name,
                          email: initialValues.owner.email,
                        }
                        : {})
                    } // Prefill initial value if available
                    disabled={shouldDisable}
                    onChange={handleUserChange}
                    defaultValue={
                      selectedUser ||
                      currentSelectedUser ||
                      (initialValues?.owner
                        ? {
                          id: initialValues.owner.id,
                          name: initialValues.owner.name,
                          email: initialValues.owner.email,
                        }
                        : {})
                    }
                  />
                </div>
                <Button onClick={openUserModal}>
                  {t('form:form-title-create-user')}
                </Button>
                <ValidationError
                  message={errors?.user?.message && t(errors.user.message)}
                />
                <Modal open={isUserModalOpen} onClose={closeUserModal}>
                  <CustForm
                    onClose={closeUserModal}
                    onUserCreated={handleUserCreated}
                  />
                </Modal>
              </div>
            }

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
            {
              !shouldDisable &&
              <Input
                type="number"
                label={t('Dealer count')}
                {...register('dealerCount')}
                variant="outline"
                className="mb-5"
                error={t(errors.balance?.payment_info?.name?.message!)}
              />
            }
          </Card>
        </div>
        {!shouldDisable &&
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:input-label-comapny-type')}
              details={t('form:shop-company-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="relative mb-5">
                <Label>{t('form:input-label-select-company')}</Label>
                <Controller
                  name="permission"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={permissionOptions}
                      placeholder="Select permissions"
                      isSearchable={true}
                      components={{
                        Option: (props) => (
                          <div
                            {...props.innerProps}
                            className={`flex items-center justify-between p-2 ${props.isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                          >
                            <span>{`${props.data.type_name} - ${props.data.permission_name}`}</span>
                            <button
                              className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                openViewPermissionModal(props.data.e);
                              }}
                            >
                              View
                            </button>
                          </div>
                        ),
                      }}
                      getOptionLabel={(option: any) => (
                        <div className="flex justify-between items-center w-full">
                          <span>{`${option.type_name} - ${option.permission_name}`}</span>
                        </div>
                      )}
                      getOptionValue={(option: any) => option.id}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        setPermissionSelectedOption(selectedOption);
                      }}
                    />
                  )}
                />
                {/* View Permission Modal */}
                <Modal open={viewPermissionModalOpen} onClose={closeViewPermissionModal}>
                  {viewPermissionData && (
                    <CreatePerm
                      PermissionDatas={viewPermissionData}
                      selectedPermissions={selectedPermissions}
                      setSelectedPermissions={setSelectedPermissions}
                      permissionId={viewPermissionData.id}
                      onSaveSuccess={closeViewPermissionModal}
                      onPermissionCreate={handlePermissionUpdate}
                      viewMode={true}
                      flag={true}
                    />
                  )}
                </Modal>
              </div>

              <div className="relative mb-5">
                <Label>{t('form:button-label-more-permission')}</Label>
                <SelectInput
                  name="additionalPermissions"
                  placeholder="Select additional permissions"
                  control={control}
                  getOptionLabel={(option: any) =>
                    `${option.type_name} - ${option.permission_name}`
                  }
                  getOptionValue={(option: any) => option.id}
                  options={additionalPermissionOptions}
                  isSearchable={true}
                  onChange={handleSelectChange}
                  defaultValue={
                    control._defaultValues?.additionalPermissions || watch('additionalPermissions')
                  }
                  onAddPermission={handlePermissionUpdate}
                />
              </div>
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="extraPermission"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="form-checkbox mb-5 h-4 w-4 text-blue-600"
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
        }

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
            {/* <div className="mb-5">
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
            </div> */}
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
                          defaultValue={updatedIcons.find((icon) => icon.value === item?.icon)}
                          getOptionLabel={(option: any) => option.label} // render JSX
                          getOptionValue={(option: any) => option.value}
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