import Input from '@/components/ui/input';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Title from '@/components/ui/title';
import SelectInput from '@/components/ui/select-input';
import { useEffect } from 'react';
import { Product, Settings } from '@/types';
import { useTranslation } from 'next-i18next';
import { useAttributesQuery } from '@/data/attributes';
import FileInput from '@/components/ui/file-input';
import ValidationError from '@/components/ui/form-validation-error';
import {
  // getCartesianProduct, 
  filterAttributes
} from './form-utils';
import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';
import Checkbox from '@/components/ui/checkbox/checkbox';
import groupBy from 'lodash/groupBy';

type IProps = {
  initialValues?: Product | null;
  shopId: string | undefined;
  settings: Settings | undefined;
};

export default function ProductVariableForm({
  shopId,
  initialValues,
  settings,
}: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { settings: { options } } = useSettingsQuery({
    language: locale!,
  });

  const { attributes, loading } = useAttributesQuery({
    shop_id: initialValues ? initialValues.shop_id : shopId,
    language: locale,
  });

  const { register, control, watch, setValue, getValues, formState: { errors } } = useFormContext();

  const variations = watch('variations');
  // const cartesianProduct = getCartesianProduct(getValues('variations')) || {};

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variation_options',
  });

  useEffect(() => {
    if (initialValues?.variation_options) {
      remove(); // Remove all existing fields

      initialValues.variation_options.forEach((option) => {
        // Group options by attribute name
        const groupedOptions = groupBy(option.options, 'name');
        const mappedAttributes = Object.keys(groupedOptions).map((name) => {
          const opts = groupedOptions[name];
          return {
            attribute: {
              id: opts[0].id, // Assuming same attribute ID for grouped options
              name: name,
              values: opts.map(opt => ({ id: opt.id, value: opt.value })),
            },
            value: opts.map(opt => ({ id: opt.id, value: opt.value })),
          };
        });

        append({
          ...option,
          attributes: mappedAttributes,
        });
      });
    } else {
      if (fields.length === 0) {
        append({ attributes: [] });
      }
    }
  }, [initialValues]);

  const handleVariationChange = (fieldIndex: number, attributeIndex: number, selected: any, isAttribute: boolean) => {
    if (isAttribute) {
      setValue(`variation_options[${fieldIndex}].attributes[${attributeIndex}].attribute`, selected);
    } else {
      setValue(`variation_options[${fieldIndex}].attributes[${attributeIndex}].value`, selected);
    }

    const attributes = watch(`variation_options[${fieldIndex}].attributes`);

    const attributeValues = attributes.reduce((acc: any[], attr: any) => {
      // Check if attr.value is an array before calling .map
      if (Array.isArray(attr.value)) {
        const values = attr.value.map((val: any) => ({
          attribute_value_id: val.id,
        }));
        return acc.concat(values);
      }
      // Handle the case where attr.value is not an array (if needed)
      return acc;
    }, []);

    setValue('variations', attributeValues);

    const options = attributes.map((attr: any) => ({
      name: attr.attribute.name,
      value: Array.isArray(attr.value) ? attr.value.map((val: any) => val.value).join(',') : '', // Fallback if attr.value is not an array
    }));

    setValue(`variation_options[${fieldIndex}].options`, options);

    const title = attributes
      .map((attr: any) =>
        Array.isArray(attr.value) ? attr.value.map((val: any) => val.value).join(',') : ''
      )
      .join('/');

    setValue(`variation_options[${fieldIndex}].title`, title);
  };


  return (
    <>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-variation-product-info')}
          details={`${initialValues
            ? t('form:item-description-update')
            : t('form:item-description-choose')
            } ${t('form:form-description-variation-product-info')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
          <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">
            <Title className="mt-8 mb-0 px-5 text-center text-lg uppercase md:px-8">
              {t('form:form-title-options')}
            </Title>
            <div>
              {fields?.map((field, fieldIndex) => {
                return (
                  <div key={field.id} className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8">
                    <div className="flex items-center justify-between">
                      <Title className="mb-0">
                        {t('form:form-title-options')} {fieldIndex + 1}{' '}
                        {watch(`variation_options.${fieldIndex}.title`) || watch(`variation_options.${fieldIndex}.attributes`)
                          ?.map((attr: any) =>
                            Array.isArray(attr.value)
                              ? attr.value.map((val: any) => val.value).join(',')
                              : ''
                          )
                          .filter(Boolean)
                          .join('/')}
                      </Title>
                      <button
                        onClick={() => remove(fieldIndex)}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>

                    <div className="mt-5 rounded border border-gray-300 p-5">
                      <div className="grid gap-5">
                        {attributes?.items?.map((attribute, attributeIndex) => {

                          const initialOption = initialValues?.variation_options?.[fieldIndex];

                          const initialAttribute = initialOption?.options?.[attributeIndex];

                          const initialAttributeValue = initialAttribute?.value || [];

                          const initialAttributeName = initialAttribute?.attribute || null;

                          return (
                            <div key={attribute.id} className="flex flex-wrap items-center">
                              <div className="flex-1">
                                <Label>{t('form:input-label-attribute-name')}*</Label>
                                <SelectInput
                                  name={`variation_options[${fieldIndex}].attributes[${attributeIndex}].attribute`}
                                  control={control}
                                  defaultValue={initialAttributeName || `variation_options[${fieldIndex}].attributes[${attributeIndex}].attribute`}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.id}
                                  options={filterAttributes(attributes, variations)}
                                  onChange={(selected) => handleVariationChange(fieldIndex, attributeIndex, selected, true)}
                                />
                              </div>

                              <div className="flex-1">
                                <Label>{t('form:input-label-attribute-value')}*</Label>
                                <SelectInput
                                  isMulti
                                  name={`variation_options[${fieldIndex}].attributes[${attributeIndex}].value`}
                                  control={control}
                                  defaultValue={initialAttributeValue || `variation_options[${fieldIndex}].attributes[${attributeIndex}].value`}
                                  getOptionLabel={(option) => option.value}
                                  getOptionValue={(option) => option.id}
                                  options={watch(`variation_options[${fieldIndex}].attributes[${attributeIndex}].attribute`)?.values || []}
                                  onChange={(selectedOptions) => handleVariationChange(fieldIndex, attributeIndex, selectedOptions, false)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 flex flex-wrap">
                        <Input
                          label={`${t('form:input-label-name')}*`}
                          type="text"
                          {...register(`variation_options.${fieldIndex}.name`, { required: true })}
                          error={t(errors.variation_options?.[fieldIndex]?.name?.message)}
                          variant="outline"
                          className="mb-2"
                          style={{ width: '70px', height: '40px' }}
                        />
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Input
                          label={`${t('form:input-label-price')}*`}
                          type="number"
                          {...register(`variation_options.${fieldIndex}.price`, { required: true })}
                          error={t(errors.variation_options?.[fieldIndex]?.price?.message)}
                          variant="outline"
                          className="mb-2"
                          style={{ width: '70px', height: '40px' }}
                        />
                        <Input
                          label={t('form:input-label-sale-price')}
                          type="number"
                          {...register(`variation_options.${fieldIndex}.sale_price`)}
                          error={t(errors.variation_options?.[fieldIndex]?.sale_price?.message)}
                          variant="outline"
                          className="mb-2"
                          style={{ width: '70px', height: '40px' }}
                        />
                        <Input
                          label={t('form:input-label-sku') + '*'}
                          {...register(`variation_options.${fieldIndex}.sku`, { required: true })}
                          error={t(errors.variation_options?.[fieldIndex]?.sku?.message)}
                          variant="outline"
                          className="mb-2"
                          style={{ width: '70px', height: '40px' }}
                        />
                        <Input
                          label={t('form:input-label-quantity') + '*'}
                          type="number"
                          {...register(`variation_options.${fieldIndex}.quantity`, { required: true })}
                          error={t(errors.variation_options?.[fieldIndex]?.quantity?.message)}
                          variant="outline"
                          className="mb-2"
                          style={{ width: '70px', height: '40px' }}
                        />
                        <div
                          className="mb-2"
                          style={{ width: '120px', height: '30px' }}
                        >
                          <Label>{t('form:input-label-upload-image')}</Label>
                          <FileInput
                            name={`variation_options.${fieldIndex}.image`}
                            control={control}
                            multiple={false}
                          />
                        </div>
                        <div className="mb-2">
                          <Checkbox
                            {...register(`variation_options.${fieldIndex}.is_digital`)}
                            label={t('form:input-label-is-digital')}
                          />
                          {!!watch(`variation_options.${fieldIndex}.is_digital`) && (
                            <div className="mt-2">
                              <Label>{t('form:input-label-digital-file')}</Label>
                              <FileInput
                                name={`variation_options.${fieldIndex}.digital_file_input`}
                                control={control}
                                multiple={false}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <ValidationError
                        errorMessage={errors.variation_options?.[fieldIndex]?.image?.message}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              onClick={() => append({ attributes: [] })}
              className="text-sm"
            >
              {t('form:button-label-add-option')}
            </Button>
            {fields.length > 1 && (
              <Button
                onClick={() => remove(fields.length - 1)}
                className="text-sm"
                variant="danger"
              >
                {t('form:button-label-remove-last-option')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}