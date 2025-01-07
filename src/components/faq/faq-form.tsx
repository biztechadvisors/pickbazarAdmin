import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Faq } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMeQuery } from '@/data/user';
import { useState } from 'react';
// import { RegionsValidationSchema } from './region-validation-schema';
import { useCreateRegionsClassMutation, useUpdateRegionClassMutation } from '@/data/regions';
import { useCreateFaqClassMutation, useUpdateFaqClassMutation } from '@/data/faq';

const defaultValues = {
  title: '',
  description: '',

};

type IProps = {
  initialValues?: Faq | null;
};

export default function CreateOrUpdateFaqForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: me } = useMeQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Faq>({
    shouldUnregister: true,
    // resolver: yupResolver(RegionsValidationSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const shop_id = me?.shop_id;

  const { mutate: createFaqClass, isLoading: creating } =
    useCreateFaqClassMutation(shop_id);
  const { mutate: updateFaqClass, isLoading: updating } =
    useUpdateFaqClassMutation(shop_id);

  const onSubmit = async (values: Faq) => {
    if (initialValues) {
      updateFaqClass({
        id: initialValues.id!,
        ...values,
      });
    } else {
      createFaqClass({
        ...values,
      });
    }
  };

  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-faq')}
          //   details={`${initialValues
          //     ? t('form:item-description-update')
          //     : t('form:item-description-add')
          //     } ${t('form:tax-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />


        <Card className="w-full sm:w-8/12 md:w-2/3">


          <Input
            label={t('form:input-label-title')}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-description')}
            {...register('description')}
            error={t(errors.description?.message!)}
            variant="outline"
            className="mb-5"
          />

          {/* <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">
            {t('form:input-label-name')}
          </label>
          <select
           {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={ selectedCountry?selectedCountry: countryData.some((country) => country.code === initialValues?.name)
              ? initialValues?.name
              : selectedCountry}
            onChange={handleCountryChange}>
            <option value="" disabled>
              {t('')}
            </option>
            {countryData.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
            </select>
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div> */}
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
        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update')
            : t('form:button-label-add')}{' '}
          {t('form:form-title-faq')}
        </Button>
      </div>
    </form>
  );
}