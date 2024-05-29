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
import { SUPER_ADMIN, STORE_OWNER } from '@/utils/constants';
import { useModalAction } from '../ui/modal/modal.context';
import OpenAIButton from '../openAI/openAI.button';
import { useCallback, useMemo } from 'react';
import { useSettingsQuery } from '@/data/settings';
import Select from '../ui/select/select';
import { useMeQuery, useUserQuery, useVendorQuery } from '@/data/user';
import ValidationError from '../ui/form-validation-error';

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

function SelectUser({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();

  const { data } = useMeQuery();
  const usrById = data?.id;

  const { data: users, isLoading } = useVendorQuery(usrById);

  const options: any = users || [];

  return (
    <div className="mb-5">
      <Label>{t('form:input-label-search')}</Label>
      <SelectInput
        name="user"
        control={control}
        getOptionLabel={(option: any) => `${option.name} - ${option.email}`}
        getOptionValue={(option: any) => option}
        options={options.data}
        isLoading={isLoading}
        isSearchable={true}
        filterOption={(option: any, inputValue: any) => {
          // Customize the filter logic as needed
          const searchValue = inputValue.toLowerCase();
          return (
            option.name.toLowerCase().includes(searchValue) ||
            option.email.toLowerCase().includes(searchValue)
          );
        }}
        defaultValue={[]}
      />
      <ValidationError message={t(errors.user?.message)} />
    </div>
  );
}

const ShopForm = ({ initialValues }: { initialValues?: any }) => {
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  // const { permissions } = getAuthCredentials();
  // let permission = hasAccess(adminAndOwnerOnly, permissions);
  const { permissions } = getAuthCredentials();
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
  const { openModal } = useModalAction();
  const { locale } = router;
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
  function onSubmit(values: FormValues) {
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
    if (initialValues) {
      const { ...restAddress } = values.address;
      updateShop({
        id: initialValues.id,
        ...values,
        address: restAddress,
        settings,
        balance: {
          id: initialValues.balance?.id,
          ...values.balance,
        },
      });
    } else {
      createShop({
        ...values,
        settings,
        balance: {
          ...values.balance,
        },
      });
    }
  }

  const coverImageInformation = (
    <span>
      {t('form:shop-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">1170 x 435{t('common:text-px')}</span>
    </span>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

            <SelectUser control={control} errors={errors} />

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

        {permissions?.includes(STORE_OWNER) ? (
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
                      {/* <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-icon")}
                        variant="outline"
                        {...register(`settings.socials.${index}.icon` as const)}
                        defaultValue={item?.icon!} // make sure to set up defaultValue
                      /> */}
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
