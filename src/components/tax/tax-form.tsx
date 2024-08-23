import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Tax } from '@/types';
import {
  useCreateTaxClassMutation,
  useUpdateTaxClassMutation,
} from '@/data/tax';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { taxValidationSchema } from './tax-validation-schema';
import { useMeQuery } from '@/data/user';
import { useState } from 'react';

const defaultValues = {
  name: '',
  rate: 0,
  cgst: '',
  sgst: '',
  hsn_no: '',
  sac_no: '',
  compensation_Cess: '',
};

type IProps = {
  initialValues?: Tax | null;
};

export default function CreateOrUpdateTaxForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: meData } = useMeQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Tax>({
    shouldUnregister: true,
    resolver: yupResolver(taxValidationSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const shop_id = meData?.shop_id;
  const { mutate: createTaxClass, isLoading: creating } =
    useCreateTaxClassMutation(shop_id);
  const { mutate: updateTaxClass, isLoading: updating } =
    useUpdateTaxClassMutation(shop_id);

  const onSubmit = async (values: Tax) => {
    if (initialValues) {
      updateTaxClass({
        id: initialValues.id!,
        ...values,
        shop_id,
      });
    } else {
      createTaxClass({
        ...values,
        shop_id,
      });
    }
  };

  // State to track the selected option
  const [selectedKey, setSelectedKey] = useState('hsn_no');
  const inputValue = watch(selectedKey);

  const handleKeyChange = (e) => {
    const newKey = e.target.value;
    setSelectedKey(newKey);
    // Clear the value of the unselected key
    setValue(newKey === 'hsn_no' ? 'sac_no' : 'hsn_no', null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={`${initialValues
            ? t('form:item-description-update')
            : t('form:item-description-add')
            } ${t('form:tax-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name', { required: 'Name is required' })}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-rate')}
            {...register('rate')}
            type="number"
            error={t(errors.rate?.message!)}
            variant="outline"
            className="mb-5"
          />

          {/* Dropdown to select key */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              {t('form:select-label-gst-type')}
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={selectedKey}
              onChange={handleKeyChange}
            >
              <option value="hsn_no">{t('form:input-label-hsn_no')}</option>
              <option value="sac_no">{t('form:input-label-sac_no')}</option>
            </select>
          </div>

          {/* Conditional input field based on dropdown selection */}
          <Input
            label={t(`form:input-label-${selectedKey}`)}
            {...register(selectedKey)}
            value={inputValue || ''}
            onChange={(e) => setValue(selectedKey, e.target.value)}
            error={t(errors[selectedKey]?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-cgst')}
            {...register('cgst')}
            error={t(errors.cgst?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-sgst')}
            {...register('sgst')}
            error={t(errors.sgst?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-compensatoin')}
            {...register('compensation_Cess')}
            error={t(errors.compensation_Cess?.message!)}
            variant="outline"
            className="mb-5"
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
        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update')
            : t('form:button-label-add')}{' '}
          {t('form:button-label-tax')}
        </Button>
      </div>
    </form>
  );
}