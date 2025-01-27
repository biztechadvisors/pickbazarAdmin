// import Input from '@/components/ui/input';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import Label from '@/components/ui/label';
// import Title from '@/components/ui/title';
// import SelectInput from '@/components/ui/select-input';
// import { useEffect } from 'react';
// import { Product, Settings } from '@/types';
// import { useTranslation } from 'next-i18next';
// import { useAttributesQuery } from '@/data/attributes';
// import FileInput from '@/components/ui/file-input';
// import ValidationError from '@/components/ui/form-validation-error';
// import { getCartesianProduct, filterAttributes } from './form-utils';
// import { useRouter } from 'next/router';
// import { Config } from '@/config';
// import { useSettingsQuery } from '@/data/settings';
// import Checkbox from '@/components/ui/checkbox/checkbox';
// type IProps = {
//   initialValues?: Product | null;
//   shopId: string | undefined;
//   settings: Settings | undefined;
// };

// export default function ProductVariableForm({
//   shopId,
//   initialValues,
//   settings: initialSettings, // Rename settings prop to initialSettings
// }: IProps) {
//   const { t } = useTranslation();
//   const { locale } = useRouter();
//   console.log('initialValue::', initialValues);
//   // Rename loading from useSettingsQuery to avoid conflict
//   const {
//     settings,
//     error,
//     loading: isSettingsLoading,
//   } = useSettingsQuery({
//     language: locale!,
//   });

//   if (isSettingsLoading) {
//     console.log('Loading settings...');
//   }

//   if (error) {
//     console.log('Error fetching settings:', error);
//   }

//   // Use `settings` from the query instead of the `initialSettings` prop here

//   const { attributes, loading } = useAttributesQuery({
//     shop_id: initialValues ? initialValues.shop_id : shopId,
//     language: locale,
//   });
//   const {
//     register,
//     control,
//     watch,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useFormContext();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'variations',
//   });
// console.log("Fields ::",fields);
//   const variations = watch('variations');

//   const cartesianProduct = getCartesianProduct(getValues('variations')) || {};

//   useEffect(() => {
//     if (initialValues?.variations?.length) {
//       initialValues.variations.forEach((variation, index) => {
//         append({ ...variation, isOpen: index === 0 }); // Only the first card is open
//       });
//     }
//   }, [initialValues]);
// console.log("Attribute ::",attributes);
//   return (
//     <>
//       <div className="my-5 flex flex-wrap sm:my-8">
//         <Description
//           title={t('form:form-title-variation-product-info')}
//           details={`${
//             initialValues
//               ? t('form:item-description-update')
//               : t('form:item-description-choose')
//           } ${t('form:form-description-variation-product-info')}`}
//           className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//         />
//         <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
//           <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">
//             <Title className="mt-8 mb-0 px-5 text-center text-lg uppercase md:px-8">
//               {t('form:form-title-options')}
//             </Title>
//             <div>
//               {fields?.map((field, fieldIndex) => (
//                 <div
//                   key={field.id}
//                   className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
//                 >
//                   <div className="flex items-center justify-between">
//                   <Title className="mb-0">
//               {t('form:form-title-options')} {fieldIndex + 1}{' '}
//               {watch(`variations.${fieldIndex}.attributes`)
//                 ?.map((attr) =>
//                   Array.isArray(attr.value)
//                     ? attr.value.map((val) => val.value).join(', ') // Extract and join values
//                     : ''
//                 )
//                 .filter(Boolean)
//                 .join(' | ')}
//             </Title>
//                     <button
//                       onClick={() => remove(fieldIndex)}
//                       type="button"
//                       className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
//                     >
//                       {t('form:button-label-remove')}
//                     </button>
//                   </div>
//                   <div className="mt-5 rounded border border-gray-300 p-5">
//                     <div className="grid gap-5">
//                       {attributes?.items?.map((attribute, attributeIndex) => (
//                         <div
//                           key={attribute.id}
//                           className="flex flex-wrap items-center"
//                         >
//                           <div className="flex-1">
//                             <Label>
//                               {t('form:input-label-attribute-name')}*
//                             </Label>
//                             <SelectInput
//                               name={`variations.${fieldIndex}.attributes.${attributeIndex}.attribute`}
//                               control={control}
//                               defaultValue={field.attribute || ''}
//                               getOptionLabel={(option) => option.name}
//                               getOptionValue={(option) => option.id}
//                               options={
//                                 initialValues?.length > 0
//                                   ? initialValues.variation_options[0].options // Use options from variation_option if available
//                                   : filterAttributes(
//                                       attributes,
//                                       variations,
//                                       fieldIndex
//                                     ) // Fall back to filterAttributes
//                               }
//                               isLoading={loading}
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <Label>
//                               {t('form:input-label-attribute-value')}*
//                             </Label>
//                             <SelectInput
//                               isMulti
//                               name={`variations.${fieldIndex}.attributes.${attributeIndex}.value`}
//                               control={control}
//                               defaultValue={field.value || []} // Initialize as an empty array if no value is present
//                               getOptionLabel={(option) => option.value}
//                               getOptionValue={(option) => option.id}
//                               options={
//                                 watch(
//                                   `variations.${fieldIndex}.attributes.${attributeIndex}.attribute`
//                                 )?.values || [] // Use values if the attribute is selected
//                               }
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <TitleAndOptionsInput
//                       register={register}
//                       setValue={setValue}
//                       index={fieldIndex}
//                       fieldAttributeValue={field}
//                       cartesianProduct={cartesianProduct} // Pass cartesianProduct here
//                     />
//                     <div className="mt-5 flex flex-wrap">
//                       <Input
//                         label={`${t('form:input-label-name')}*`}
//                         type="text"
//                         {...register(`variation_options.${fieldIndex}.name`, {
//                           required: true,
//                         })}
//                         error={t(
//                           errors.variation_options?.[fieldIndex]?.name?.message
//                         )}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                     </div>
//                     <div className="mt-5 flex flex-wrap gap-2">
//                       <Input
//                         label={`${t('form:input-label-price')}*`}
//                         type="number"
//                         {...register(`variation_options.${fieldIndex}.price`, {
//                           required: true,
//                         })}
//                         error={t(
//                           errors.variation_options?.[fieldIndex]?.price?.message
//                         )}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={t('form:input-label-sale-price')}
//                         type="number"
//                         {...register(
//                           `variation_options.${fieldIndex}.sale_price`
//                         )}
//                         error={t(
//                           errors.variation_options?.[fieldIndex]?.sale_price
//                             ?.message
//                         )}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={`${t('form:input-label-sku')}*`}
//                         {...register(`variation_options.${fieldIndex}.sku`, {
//                           required: true,
//                         })}
//                         error={t(
//                           errors.variation_options?.[fieldIndex]?.sku?.message
//                         )}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={`${t('form:input-label-quantity')}*`}
//                         type="number"
//                         {...register(
//                           `variation_options.${fieldIndex}.quantity`,
//                           { required: true }
//                         )}
//                         error={t(
//                           errors.variation_options?.[fieldIndex]?.quantity
//                             ?.message
//                         )}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <div
//                         className="mb-2"
//                         style={{ width: '120px', height: '30px' }}
//                       >
//                         <Label>Upload an image</Label>
//                         <FileInput
//                           name={`variation_options.${fieldIndex}.image`}
//                           control={control}
//                           multiple={false}
//                         />
//                       </div>
//                       <div className="mb-2">
//                         <Checkbox
//                           {...register(
//                             `variation_options.${fieldIndex}.is_digital`
//                           )}
//                           label={t('form:input-label-is-digital')}
//                         />
//                         {!!watch(
//                           `variation_options.${fieldIndex}.is_digital`
//                         ) && (
//                           <div className="mt-2">
//                             <Label>{t('form:input-label-digital-file')}</Label>
//                             <FileInput
//                               name={`variation_options.${fieldIndex}.digital_file_input`}
//                               control={control}
//                               multiple={false}
//                               acceptFile={true}
//                               helperText={t('form:text-upload-digital-file')}
//                               defaultValue={{}}
//                             />
//                             <ValidationError
//                               message={t(
//                                 errors?.variation_options?.[fieldIndex]
//                                   ?.digital_file_input?.message
//                               )}
//                             />
//                             <input
//                               type="hidden"
//                               {...register(
//                                 `variation_options.${fieldIndex}.digital_file`
//                               )}
//                             />
//                           </div>
//                         )}
//                       </div>
//                       <div className="mb-2">
//                         <Checkbox
//                           {...register(
//                             `variation_options.${fieldIndex}.is_disable`
//                           )}
//                           error={t(
//                             errors.variation_options?.[fieldIndex]?.is_disable
//                               ?.message
//                           )}
//                           label={t('form:input-label-disable-variant')}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="px-5 md:px-8">
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     // Append with empty values to ensure new card has its own state
//                     append({
//                       attributes: attributes?.items?.map(() => ({
//                         attribute: '',
//                         value: [],
//                       })),
//                       value: [],
//                       name: '',
//                       price: '',
//                       sale_price: '',
//                       sku: '',
//                       quantity: '',
//                       image: '',
//                       is_digital: false,
//                       is_disable: false,
//                     });
//                   }}
//                   type="button"
//                 >
//                   {t('form:button-label-add-option')}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// }

// export const TitleAndOptionsInput = ({
//   fieldAttributeValue,
//   index,
//   setValue,
//   register,
//   cartesianProduct,
// }: any) => {
//   const title = Array.isArray(cartesianProduct)
//     ? cartesianProduct
//         .flatMap((a) => a.value) // Flatten the values
//         .join('/') // Join with a slash
//         .replace(/,\s*/g, '/') // Replace any commas with slashes
//     : cartesianProduct.value;

//   const options = Array.isArray(cartesianProduct)
//     ? cartesianProduct.map((item) => ({
//         attribute: item.name,
//         values: item.value,
//       }))
//     : [
//         {
//           attribute: cartesianProduct.attribute.name,
//           values: cartesianProduct.value,
//         },
//       ];

//   useEffect(() => {
//     setValue(`variation_options.${index}.title`, title);
//     setValue(`variation_options.${index}.options`, options);
//   }, [fieldAttributeValue, setValue, index, title, options]);
//   return (
//     <>
//       <input {...register(`variation_options.${index}.title`)} type="hidden" />
//       <input
//         {...register(`variation_options.${index}.options`)}
//         type="hidden"
//       />
//     </>
//   );
// };
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
import { getCartesianProduct, filterAttributes } from './form-utils';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import Checkbox from '@/components/ui/checkbox/checkbox';
type IProps = {
  initialValues?: Product | null;
  shopId: string | undefined;
  settings: Settings | undefined;
};

export default function ProductVariableForm({
  shopId,
  initialValues,
  settings: initialSettings, // Rename settings prop to initialSettings
}: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();

  // Rename loading from useSettingsQuery to avoid conflict
  const {
    settings,
    error,
    loading: isSettingsLoading,
  } = useSettingsQuery({
    language: locale!,
  });
  console.log("INItialVAlue ::", initialValues)
  if (isSettingsLoading) {
    console.log('Loading settings...');
  }

  if (error) {
    console.log('Error fetching settings:', error);
  }

  // Use `settings` from the query instead of the `initialSettings` prop here

  const { attributes, loading } = useAttributesQuery({
    shop_id: initialValues ? initialValues.shop_id : shopId,
    language: locale,
  });
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  console.log('initialValues.variation_options 66 ', initialValues.variation_options)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  });

  // useEffect(() => {
  //   // Ensure initialValues.variation_options are appended only once
  //   if (initialValues?.variation_options && fields.length === 0) {
  //     // Map initial values to match the structure of fields and include attributes/values
  //     const formattedFields = initialValues.variation_options.map((option) => ({
  //       ...option,
  //       attributes: attributes?.items.map((attribute) => ({
  //         attribute: attributes.items.find((attr) => attr.name === attribute.name) || null,
  //         value: option.options
  //           .filter((opt) => opt.name === attribute.name)
  //           .map((opt) => ({
  //             id: opt.id,
  //             value: opt.value,
  //           })),
  //       })),
  //     }));

  //     append(formattedFields); // Append formatted options
  //   }
  // }, [initialValues, fields, append, attributes]);

  const variations = watch('variations');

  console.log('variations 81 ', variations)

  const cartesianProduct = getCartesianProduct(getValues('variations')) || {};


  useEffect(() => {
    console.log("first ::", initialValues?.variation_options)
    if (initialValues?.variation_options?.length) {
      const initialVariations = initialValues.variation_options.map((option) => ({
        attributes: option.options.map((attr) => ({
          attribute: { id: attr.id, name: attr.name }, // Ensure attribute mapping
          value: { id: attr.id, value: attr.value },   // Ensure value mapping
        })),
      }));
      setValue('variations', initialVariations);
    }
  }, [initialValues, setValue]);
  console.log("initialValue ::", initialValues)



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
              {fields?.map((field, fieldIndex) => (
                <div
                  key={field.id}
                  className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    {/* <Title className="mb-0">
                      {t('form:form-title-options')} {fieldIndex + 1}
                    </Title> */}
                    <Title className="mb-0">
                      {t('form:form-title-options')} {fieldIndex + 1}{' '}
                      {watch(`variations.${fieldIndex}.attributes`)
                        ?.map((attr) =>
                          Array.isArray(attr.value)
                            ? attr.value.map((val) => val.value).join(', ') // Extract and join values
                            : ''
                        )
                        .filter(Boolean)
                        .join(' | ')}
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
                    {/* <div className="grid gap-5">
                    {attributes?.items?.map((attribute, attributeIndex) => (
                        <div
                          key={attribute.id}
                          className="flex flex-wrap items-center"
                        >
                          <div className="flex-1">
                            <Label>
                              {t('form:input-label-attribute-name')}*
                            </Label>
                            <SelectInput
                              name={variations.${fieldIndex}.attributes.${attributeIndex}.attribute}
                              control={control}
                              // defaultValue={
                              //   field.attributes?.[attributeIndex]?.attribute || ''
                              // }
                              defaultValue={
                                watch(variations.${fieldIndex}.attributes.${attributeIndex}.attribute) || null
                              }
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              options={attributes?.items || []}
                              isLoading={loading}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>
                              {t('form:input-label-attribute-value')}*
                            </Label>
                            <SelectInput
                              isMulti
                              name={variations.${fieldIndex}.attributes.${attributeIndex}.value}
                              control={control}
                              // defaultValue={
                              //   field.attributes?.[attributeIndex]?.value || []
                              // }
                              defaultValue={
                                watch(variations.${fieldIndex}.attributes.${attributeIndex}.value) || []
                              }
                              getOptionLabel={(option) => option.value}
                              getOptionValue={(option) => option.id}
                              options={
                                watch(
                                  variations.${fieldIndex}.attributes.${attributeIndex}.attribute
                                )?.values || []
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div> */}
                    <div className="grid gap-5">
                      {attributes?.items?.map((attribute, attributeIndex) => (
                        <div key={attribute.id} className="flex flex-wrap items-center">
                          {/* Attribute Name */}
                          <div className="flex-1">
                            <Label>
                              {t('form:input-label-attribute-name')}*
                            </Label>
                            <SelectInput
                              name={`variations[${fieldIndex}].attributes[${attributeIndex}].attribute`}
                              control={control}
                              defaultValue={
                                watch(`variations[${fieldIndex}].attributes[${attributeIndex}].attribute`) || null
                              }
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              options={attributes?.items || []}
                              isLoading={loading}
                              onChange={(selected) => {
                                console.log('Selected Attribute:', selected); // Debugging
                                setValue(
                                  `variations[${fieldIndex}].attributes[${attributeIndex}].attribute`,
                                  selected
                                );
                              }}
                            />
                          </div>

                          {/* Attribute Value */}
                          <div className="flex-1">
                            <Label>
                              {t('form:input-label-attribute-value')}*
                            </Label>
                            <SelectInput
                              isMulti
                              name={`variations[${fieldIndex}].attributes[${attributeIndex}].value`}
                              control={control}
                              defaultValue={
                                watch(`variations[${fieldIndex}].attributes[${attributeIndex}].value`) || []
                              }
                              getOptionLabel={(option) => option.value}
                              getOptionValue={(option) => option.id}
                              options={
                                watch(`variations[${fieldIndex}].attributes[${attributeIndex}].attribute`)?.values || []
                              }
                              onChange={(selectedOptions) => {
                                console.log('Selected Values:', selectedOptions); // Debugging
                                setValue(
                                  `variations[${fieldIndex}].attributes[${attributeIndex}].value`,
                                  selectedOptions
                                );
                              }}
                            />

                          </div>
                        </div>
                      ))}
                    </div>

                    <TitleAndOptionsInput
                      register={register}
                      setValue={setValue}
                      index={fieldIndex}
                      fieldAttributeValue={field}
                      cartesianProduct={cartesianProduct} // Pass cartesianProduct here
                    />
                    <div className="mt-5 flex flex-wrap">
                      <Input
                        label={`${t('form:input-label-name')}*`}
                        type="text"
                        {...register(`variation_options.${fieldIndex}.name`, {
                          required: true,
                        })}
                        error={t(
                          errors.variation_options?.[fieldIndex]?.name?.message
                        )}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Input
                        label={`${t('form:input-label-price')}*`}
                        type="number"
                        {...register(`variation_options.${fieldIndex}.price`, {
                          required: true,
                        })}
                        error={t(
                          errors.variation_options?.[fieldIndex]?.price?.message
                        )}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                      <Input
                        label={t('form:input-label-sale-price')}
                        type="number"
                        {...register(
                          `variation_options.${fieldIndex}.sale_price`
                        )}
                        error={t(
                          errors.variation_options?.[fieldIndex]?.sale_price
                            ?.message
                        )}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                      <Input
                        label={`${t('form:input-label-sku')}*`}
                        {...register(`variation_options.${fieldIndex}.sku`, {
                          required: true,
                        })}
                        error={t(
                          errors.variation_options?.[fieldIndex]?.sku?.message
                        )}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                      <Input
                        label={`${t('form:input-label-quantity')}*`}
                        type="number"
                        {...register(
                          `variation_options.${fieldIndex}.quantity`,
                          { required: true }
                        )}
                        error={t(
                          errors.variation_options?.[fieldIndex]?.quantity
                            ?.message
                        )}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                      <div
                        className="mb-2"
                        style={{ width: '120px', height: '30px' }}
                      >
                        <Label>Upload an image</Label>
                        <FileInput
                          name={`variation_options.${fieldIndex}.image`}
                          control={control}
                          multiple={false}
                        />
                      </div>
                      <div className="mb-2">
                        <Checkbox
                          {...register(
                            `variation_options.${fieldIndex}.is_digital`
                          )}
                          label={t('form:input-label-is-digital')}
                        />
                        {!!watch(
                          `variation_options.${fieldIndex}.is_digital`
                        ) && (
                            <div className="mt-2">
                              <Label>{t('form:input-label-digital-file')}</Label>
                              <FileInput
                                name={`variation_options.${fieldIndex}.digital_file_input`}
                                control={control}
                                multiple={false}
                                acceptFile={true}
                                helperText={t('form:text-upload-digital-file')}
                                defaultValue={{}}
                              />
                              <ValidationError
                                message={t(
                                  errors?.variation_options?.[fieldIndex]
                                    ?.digital_file_input?.message
                                )}
                              />
                              <input
                                type="hidden"
                                {...register(
                                  `variation_options.${fieldIndex}.digital_file`
                                )}
                              />
                            </div>
                          )}
                      </div>
                      <div className="mb-2">
                        <Checkbox
                          {...register(
                            `variation_options.${fieldIndex}.is_disable`
                          )}
                          error={t(
                            errors.variation_options?.[fieldIndex]?.is_disable
                              ?.message
                          )}
                          label={t('form:input-label-disable-variant')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-5 md:px-8">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    // Append with empty values to ensure new card has its own state
                    append({
                      attributes: attributes?.items?.map(() => ({
                        attribute: '',
                        value: [],
                      })),
                      value: [],
                      name: '',
                      price: '',
                      sale_price: '',
                      sku: '',
                      quantity: '',
                      image: '',
                      is_digital: false,
                      is_disable: false,
                    });
                  }}
                  type="button"
                >
                  {t('form:button-label-add-option')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export const TitleAndOptionsInput = ({
  fieldAttributeValue,
  index,
  setValue,
  register,
  cartesianProduct,
}: any) => {

  const title = Array.isArray(cartesianProduct)
    ? cartesianProduct
      .flatMap((a) => a.value) // Flatten the values
      .join('/') // Join with a slash
      .replace(/,\s*/g, '/') // Replace any commas with slashes
    : cartesianProduct.value;

  const options = Array.isArray(cartesianProduct)
    ? cartesianProduct.map((item) => ({
      attribute: item.name,
      values: item.value,
    }))
    : [
      {
        attribute: cartesianProduct.attribute.name,
        values: cartesianProduct.value,
      },
    ];

  useEffect(() => {
    setValue(`variation_options.${index}.title`, title);
    setValue(`variation_options.${index}.options`, options);
  }, [fieldAttributeValue, setValue, index, title, options]);
  return (
    <>
      <input {...register(`variation_options.${index}.title`)} type="hidden" />
      <input
        {...register(`variation_options.${index}.options`)}
        type="hidden"
      />
    </>
  );
};