// import Input from '@/components/ui/input';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import Label from '@/components/ui/label';
// import Title from '@/components/ui/title';
// import Checkbox from '@/components/ui/checkbox/checkbox';
// import SelectInput from '@/components/ui/select-input';
// import { useEffect, useState } from 'react';
// import { Product, Settings } from '@/types';
// import { useTranslation } from 'next-i18next';
// import { useAttributesQuery } from '@/data/attributes';
// import FileInput from '@/components/ui/file-input';
// import ValidationError from '@/components/ui/form-validation-error';
// import { getCartesianProduct, filterAttributes } from './form-utils';
// import { useRouter } from 'next/router';
// import { Config } from '@/config';
// import { useSettingsQuery } from '@/data/settings';

// type IProps = {
//   initialValues?: Product | null;
//   shopId: string | undefined;
//   settings: Settings | undefined;
// };

// export default function ProductVariableForm({
//   shopId,
//   initialValues,
//   settings,
// }: IProps) {

//   const { t } = useTranslation();
//   const { locale } = useRouter();
//   const {

//     // @ts-ignore
//     settings: { options },
//   } = useSettingsQuery({
//     language: locale!,

//   });

//   const upload_max_filesize = options?.server_info?.upload_max_filesize / 1024;

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

//   // This field array will keep all the attribute dropdown fields

//   const { fields, append, remove } = useFieldArray({

//     shouldUnregister: true,

//     control,

//     name: 'variations',

//   });

//   const variations = watch('variations');

//   const cartesianProduct = getCartesianProduct(getValues('variations')) || [];

//   // const [autoFill, setAutoFill] = useState(false);

//   const combinedVariationOptions = [

//     ...(initialValues?.variation_options || []),

//     ...cartesianProduct,

//   ];

//   // useEffect(() => {
//   //   if (initialValues?.variations) {
//   //     initialValues.variations.forEach((variation: any) => {
//   //       append({
//   //         attribute: variation.attribute,
//   //         value: variation.value,
//   //       });
//   //     });
//   //   }
//   // }, [initialValues, append]);
//   return (

//     <div className="my-5 flex flex-wrap sm:my-8">
//       <Description
//         title={t('form:form-title-variation-product-info')}
//         details={`${initialValues
//           ? t('form:item-description-update')
//           : t('form:item-description-choose')
//           } ${t('form:form-description-variation-product-info')}`}
//         className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//       />

//       <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
//         <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">

//           {/* {(!!combinedVariationOptions.length) && ( */}
//           <Title className="mt-8 mb-0 px-5 text-center text-lg uppercase md:px-8">
//             {t('form:form-title-options')}
//           </Title>
//           <div>
//             {fields?.map((field: any, index: number) => {
//               return (
//                 <div
//                   key={field.id}
//                   className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
//                 >
//                   <div className="flex items-center justify-between">
//                     <Title className="mb-0">
//                       {t('form:form-title-options')} {index + 1}
//                     </Title>

//                     <button
//                       onClick={() => remove(index)}
//                       type="button"
//                       className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
//                     >
//                       {t('form:button-label-remove')}
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-fit gap-5">
//                     <div className="mt-5">
//                       <Label>{t('form:input-label-attribute-name')}*</Label>
//                       <SelectInput

//                         name={`variations.${index}.attribute`}
//                         control={control}
//                         defaultValue={field.attribute}
//                         getOptionLabel={(option: any) => option.name}
//                         getOptionValue={(option: any) => option.id}
//                         options={filterAttributes(attributes, variations)!}
//                         isLoading={loading}
//                       />
//                     </div>
//                     <div className="col-span-2 mt-5">
//                       <Label>{t('form:input-label-attribute-value')}*</Label>
//                       <SelectInput
//                         isMulti
//                         name={`variations.${index}.value`}
//                         control={control}
//                         defaultValue={field.value}
//                         getOptionLabel={(option: any) => option.value}
//                         getOptionValue={(option: any) => option.id}
//                         options={watch(`variations.${index}.attribute`)?.values}
//                       />
//                     </div>
//                   </div>
//                   {/* <div className="mb-5 flex items-center mt-5">
//             <Checkbox
//               checked={autoFill}
//               onChange={(e) => setAutoFill(e.target.checked)}
//               label={t('form:checkbox-label-auto-fill')}
//             />
//           </div> */}
//                 </div>

//               );
//             })}
//           </div>
//           <div className="px-5 md:px-8">
//             <Button
//               disabled={fields.length === attributes?.length}
//               onClick={(e: any) => {
//                 e.preventDefault();
//                 append({ attribute: '', value: [] });
//               }}
//               type="button"
//             >
//               {t('form:button-label-add-option')}
//             </Button>
//           </div>

//           {/* Preview generation section start */}

//           {(!!combinedVariationOptions.length) && (
//             <div className="mt-5 border-t border-dashed border-border-200 pt-5 md:mt-8 md:pt-8">
//               <Title className="mb-0 px-5 text-center text-lg uppercase md:px-8">
//                 {combinedVariationOptions.length} {t('form:total-variation-added')}
//               </Title>
//               <div className="flex flex-wrap justify-start">
//                 {combinedVariationOptions.map((fieldAttributeValue: any, index: number) => (
//                   <div
//                     key={`fieldAttributeValues-${index}`}
//                     className="flex flex-col items-start border-b border-dashed border-border-200 p-5 last:mb-8 last:border-0 md:p-8 md:last:pb-0 mx-2 my-2"
//                     style={{ height: '250px' }}
//                   >
//                     {/* <Title className="mb-2 !text-lg">
//                       {t('form:form-title-variant')}:{' '}
//                       <span className="font-normal text-blue-600">
//                         {Array.isArray(fieldAttributeValue)
//                           ? fieldAttributeValue?.map((a) => a.value).join('/')
//                           : fieldAttributeValue.value}
//                       </span>
//                     </Title> */}
//                     <Title className="mb-2 !text-lg">
//                       {t('form:form-title-variant')}:{' '}
//                       <span className="font-normal text-blue-600">
//                         {fieldAttributeValue.title}
//                         <input
//                           type="hidden"
//                           {...register(`variation_options.${index}.title`)}
//                           value={fieldAttributeValue.title}
//                         />
//                       </span>
//                     </Title>
//                     {/* <Title className="mb-2 !text-lg">
//       {t('form:form-title-variant')}:{' '}
//       <span className="font-normal text-blue-600">
//         {initialValues?.variation_options ? (
//           <>
//             {fieldAttributeValue.title}
//             <input
//               type="hidden"
//               {...register(`variation_options.${index}.title`)}
//               value={fieldAttributeValue.title}
//             />
//           </>
//         ) : (
//           <>
//             {Array.isArray(fieldAttributeValue)
//               ? fieldAttributeValue?.map((a) => a.value).join('/')
//               : fieldAttributeValue.value}
//           </>
//         )}
//       </span>
//     </Title> */}
//                     <TitleAndOptionsInput
//                       register={register}
//                       setValue={setValue}
//                       index={index}
//                       fieldAttributeValue={fieldAttributeValue}
//                     />
//                     <input {...register(`variation_options.${index}.id`)} type="hidden" />
//                     <div className="flex flex-wrap gap-2">
//                       <Input
//                         label={`${t('form:input-label-price')}*`}
//                         type="number"
//                         {...register(`variation_options.${index}.price`)}
//                         error={t(errors.variation_options?.[index]?.price?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={t('form:input-label-sale-price')}
//                         // label='sale'
//                         type="number"
//                         {...register(`variation_options.${index}.sale_price`)}
//                         error={t(errors.variation_options?.[index]?.sale_price?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={`${t('form:input-label-sku')}*`}
//                         note={Config.enableMultiLang ? `${t('form:input-note-multilang-sku')}` : ''}
//                         {...register(`variation_options.${index}.sku`)}
//                         error={t(errors.variation_options?.[index]?.sku?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={`${t('form:input-label-quantity')}*`}
//                         type="number"
//                         {...register(`variation_options.${index}.quantity`)}
//                         error={t(errors.variation_options?.[index]?.quantity?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <div className="mb-2" style={{ width: '120px', height: '30px' }}>
//                         <Label>
//                           {/* {t('form:input-label-image')}  */}
//                           {' Upload an image  '}
//                           {/* {upload_max_filesize} {'MB '} */}
//                         </Label>
//                         <FileInput
//                           name={`variation_options.${index}.image`}
//                           control={control}
//                           multiple={false}
//                         />
//                       </div>
//                     </div>
//                     <div className="mb-2">
//                       <Checkbox
//                         {...register(`variation_options.${index}.is_digital`)}
//                         label={t('form:input-label-is-digital')}
//                       />
//                       {!!watch(`variation_options.${index}.is_digital`) && (
//                         <div className="mt-2">
//                           <Label>{t('form:input-label-digital-file')}</Label>
//                           <FileInput
//                             name={`variation_options.${index}.digital_file_input`}
//                             control={control}
//                             multiple={false}
//                             acceptFile={true}
//                             helperText={t('form:text-upload-digital-file')}
//                             defaultValue={{}}
//                           />
//                           <ValidationError
//                             message={t(errors?.variation_options?.[index]?.digital_file_input?.message)}
//                           />
//                           <input
//                             type="hidden"
//                             {...register(`variation_options.${index}.digital_file`)}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="mb-2">
//                       <Checkbox
//                         {...register(`variation_options.${index}.is_disable`)}
//                         error={t(errors.variation_options?.[index]?.is_disable?.message)}
//                         label={t('form:input-label-disable-variant')}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }

// export const TitleAndOptionsInput = ({

//   fieldAttributeValue,
//   index,
//   setValue,
//   register,
// }: any) => {
//   const title = Array.isArray(fieldAttributeValue)
//     ? fieldAttributeValue.map((a) => a.value).join('/')
//     : fieldAttributeValue.value;
//   const options = Array.isArray(fieldAttributeValue)
//     ? JSON.stringify(fieldAttributeValue)
//     : JSON.stringify([fieldAttributeValue]);
//   useEffect(() => {
//     setValue(`variation_options.${index}.title`, title);
//     setValue(`variation_options.${index}.options`, options);
//   }, [fieldAttributeValue]);
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




// import Input from '@/components/ui/input';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import Label from '@/components/ui/label';
// import Title from '@/components/ui/title';
// import Checkbox from '@/components/ui/checkbox/checkbox';
// import SelectInput from '@/components/ui/select-input';
// import { useEffect, useState } from 'react';
// import { Product, Settings } from '@/types';
// import { useTranslation } from 'next-i18next';
// import { useAttributesQuery } from '@/data/attributes';
// import FileInput from '@/components/ui/file-input';
// import ValidationError from '@/components/ui/form-validation-error';
// import { getCartesianProduct, filterAttributes } from './form-utils';
// import { useRouter } from 'next/router';
// import { Config } from '@/config';
// import { useSettingsQuery } from '@/data/settings';

// type IProps = {
//   initialValues?: Product | null;
//   shopId: string | undefined;
//   settings: Settings | undefined;
// };

// export default function ProductVariableForm({
//   shopId,
//   initialValues,
//   settings,
// }: IProps) {

//   const { t } = useTranslation();
//   const { locale } = useRouter();
//   const {

//     // @ts-ignore
//     settings: { options },
//   } = useSettingsQuery({
//     language: locale!,

//   });

//   const upload_max_filesize = options?.server_info?.upload_max_filesize / 1024;

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

//   // This field array will keep all the attribute dropdown fields

//   const { fields, append, remove } = useFieldArray({

//     shouldUnregister: true,

//     control,

//     name: 'variations',

//   });

//   const variations = [watch('variations')];

//   const cartesianProduct = getCartesianProduct(getValues('variations')) || [];
//   const value = attributes.find(option => option.name === initialValues?.variation_options[0]?.options[0]?.name);
//   if (value) {
//     variations.push(value);
//   }

//   const combinedVariationOptions = [
//     ...(initialValues?.variation_options || []),
//     ...cartesianProduct,
//   ];

//   // const combinedVariationOptions = initialValues?.variation_options
//   // ? [...initialValues.variation_options]
//   // : [...cartesianProduct];

//   return (

//     <div className="my-5 flex flex-wrap sm:my-8">
//       <Description
//         title={t('form:form-title-variation-product-info')}
//         details={`${initialValues
//           ? t('form:item-description-update')
//           : t('form:item-description-choose')
//           } ${t('form:form-description-variation-product-info')}`}
//         className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//       />

//       <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
//         <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">

//           {/* {(!!combinedVariationOptions.length) && ( */}
//           <Title className="mt-8 mb-0 px-5 text-center text-lg uppercase md:px-8">
//             {t('form:form-title-options')}
//           </Title>
//           <div>
//             {attributes?.map((field: any, index: number) => {
//               return (
//                 <div
//                   key={field.id}
//                   className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
//                 >
//                   <div className="flex items-center justify-between">
//                     <Title className="mb-0">
//                       {t('form:form-title-options')} {index + 1}
//                     </Title>

//                     <button
//                       onClick={() => remove(index)}
//                       type="button"
//                       className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
//                     >
//                       {t('form:button-label-remove')}
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-fit gap-5">
//                     <div className="mt-5">
//                       <Label>{t('form:input-label-attribute-name')}*</Label>
//                       <SelectInput

//                         name={`variations.${index}.attribute`}
//                         control={control}
//                         defaultValue={field.attribute}
//                         getOptionLabel={(option: any) => option.name}
//                         getOptionValue={(option: any) => option.id}
//                         options={filterAttributes(attributes, variations)!}
//                         isLoading={loading}
//                       />
//                     </div>
//                     <div className="col-span-2 mt-5">
//                       <Label>{t('form:input-label-attribute-value')}*</Label>
//                       <SelectInput
//                         isMulti
//                         name={`variations.${index}.value`}
//                         control={control}
//                         defaultValue={field.value}
//                         getOptionLabel={(option: any) => option.value}
//                         getOptionValue={(option: any) => option.id}
//                         options={watch(`variations.${index}.attribute`)?.values}
//                       />
//                     </div>
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//           <div className="px-5 md:px-8">
//             <Button
//               disabled={fields.length === attributes?.length}
//               onClick={(e: any) => {
//                 e.preventDefault();
//                 append({ attribute: '', value: [] });
//               }}
//               type="button"
//             >
//               {t('form:button-label-add-option')}
//             </Button>
//           </div>

//           {/* Preview generation section start */}

//           {(!!combinedVariationOptions.length) && (
//             <div className="mt-5 border-t border-dashed border-border-200 pt-5 md:mt-8 md:pt-8">
//               <Title className="mb-0 px-5 text-center text-lg uppercase md:px-8">
//                 {combinedVariationOptions.length} {t('form:total-variation-added')}
//               </Title>
//               <div className="flex flex-wrap justify-start">
//                 {combinedVariationOptions.map((fieldAttributeValue: any, index: number) => (
//                   <div
//                     key={`fieldAttributeValues-${index}`}
//                     className="flex flex-col items-start border-b border-dashed border-border-200 p-5 last:mb-8 last:border-0 md:p-8 md:last:pb-0 mx-2 my-2"
//                     style={{ height: '250px' }}
//                   >

//                     <Title className="mb-2 !text-lg">
//                       {t('form:form-title-variant')}:{' '}
//                       <span className="font-normal text-blue-600">
//                         {fieldAttributeValue.title}
//                         {Array.isArray(fieldAttributeValue)
//                           ? fieldAttributeValue?.map((a) => a.value).join('/')
//                           : fieldAttributeValue.value}
//                         <input
//                           type="hidden"
//                           {...register(`variation_options.${index}.title`)}
//                           value={fieldAttributeValue.title}
//                         />
//                       </span>
//                     </Title>

//                     <TitleAndOptionsInput
//                       register={register}
//                       setValue={setValue}
//                       index={index}
//                       fieldAttributeValue={fieldAttributeValue}
//                     />
//                     <input {...register(`variation_options.${index}.id`)} type="hidden" />
//                     <div className="flex flex-wrap gap-2">
//                       <Input
//                         label={`${t('form:input-label-price')}*`}
//                         type="number"
//                         {...register(`variation_options.${index}.price`)}
//                         error={t(errors.variation_options?.[index]?.price?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={t('form:input-label-sale-price')}
//                         // label='sale'
//                         type="number"
//                         {...register(`variation_options.${index}.sale_price`)}
//                         error={t(errors.variation_options?.[index]?.sale_price?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={`${t('form:input-label-sku')}*`}
//                         note={Config.enableMultiLang ? `${t('form:input-note-multilang-sku')}` : ''}
//                         {...register(`variation_options.${index}.sku`)}
//                         error={t(errors.variation_options?.[index]?.sku?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <Input
//                         label={`${t('form:input-label-quantity')}*`}
//                         type="number"
//                         {...register(`variation_options.${index}.quantity`)}
//                         error={t(errors.variation_options?.[index]?.quantity?.message)}
//                         variant="outline"
//                         className="mb-2"
//                         style={{ width: '70px', height: '40px' }}
//                       />
//                       <div className="mb-2" style={{ width: '120px', height: '30px' }}>
//                         <Label>
//                           {/* {t('form:input-label-image')}  */}
//                           {' Upload an image  '}
//                           {/* {upload_max_filesize} {'MB '} */}
//                         </Label>
//                         <FileInput
//                           name={`variation_options.${index}.image`}
//                           control={control}
//                           multiple={false}
//                         />
//                       </div>
//                     </div>
//                     <div className="mb-2">
//                       <Checkbox
//                         {...register(`variation_options.${index}.is_digital`)}
//                         label={t('form:input-label-is-digital')}
//                       />
//                       {!!watch(`variation_options.${index}.is_digital`) && (
//                         <div className="mt-2">
//                           <Label>{t('form:input-label-digital-file')}</Label>
//                           <FileInput
//                             name={`variation_options.${index}.digital_file_input`}
//                             control={control}
//                             multiple={false}
//                             acceptFile={true}
//                             helperText={t('form:text-upload-digital-file')}
//                             defaultValue={{}}
//                           />
//                           <ValidationError
//                             message={t(errors?.variation_options?.[index]?.digital_file_input?.message)}
//                           />
//                           <input
//                             type="hidden"
//                             {...register(`variation_options.${index}.digital_file`)}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="mb-2">
//                       <Checkbox
//                         {...register(`variation_options.${index}.is_disable`)}
//                         error={t(errors.variation_options?.[index]?.is_disable?.message)}
//                         label={t('form:input-label-disable-variant')}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }

// export const TitleAndOptionsInput = ({
//   fieldAttributeValue,
//   index,
//   setValue,
//   register,
// }: any) => {
//   const title = Array.isArray(fieldAttributeValue)
//     ? fieldAttributeValue.map((a) => a.value).join('/')
//     : fieldAttributeValue.value;
//   const options = Array.isArray(fieldAttributeValue)
//     ? JSON.stringify(fieldAttributeValue)
//     : JSON.stringify([fieldAttributeValue]);
//   useEffect(() => {
//     setValue(`variation_options.${index}.title`, title);
//     setValue(`variation_options.${index}.options`, options);
//   }, [fieldAttributeValue]);
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
import { useFieldArray, useFormContext } from 'react-hook-form';
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
 
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
 
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  });
 
  const variations = watch('variations');
  const cartesianProduct = getCartesianProduct(getValues('variations')) || {};
 
  return (
    <>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-variation-product-info')}
          details={`${initialValues
            ? t('form:item-description-update')
            : t('form:item-description-choose')} ${t('form:form-description-variation-product-info')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
          <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">
            <Title className="mt-8 mb-0 px-5 text-center text-lg uppercase md:px-8">
              {t('form:form-title-options')}
            </Title>
            <div>
              {fields?.map((field, fieldIndex) => (
                <div key={field.id} className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8">
                  <div className="flex items-center justify-between">
                    <Title className="mb-0">
                      {t('form:form-title-options')} {fieldIndex + 1}
                    </Title>
                    <button
                      onClick={() => remove(fieldIndex)}
                      type="button"
                      className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                    >
                      {t('form:button-label-remove')}
                    </button>
                  </div>
                  <div className="mt-5 p-5 border rounded border-gray-300">
                    <div className="grid gap-5">
                      {attributes.map((attribute, attributeIndex) => (
                        <div key={attribute.id} className="flex flex-wrap items-center">
                          <div className="flex-1">
                            <Label>{t('form:input-label-attribute-name')}*</Label>
                            <SelectInput
                              name={`variations.${attributeIndex}.attribute`}
                              control={control}
                              defaultValue={field.attribute || ''}
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              options={filterAttributes(attributes, variations)!}
                              isLoading={loading}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>{t('form:input-label-attribute-value')}*</Label>
                            <SelectInput
                              isMulti
                              name={`variations.${attributeIndex}.value`}
                              control={control}
                              defaultValue={field.value || []} // Initialize as an empty array
                              getOptionLabel={(option) => option.value}
                              getOptionValue={(option) => option.id}
                              options={watch(`variations.${attributeIndex}.attribute`)?.values}
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
                    <div className="flex flex-wrap mt-5">
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
                    <div className="flex flex-wrap gap-2 mt-5">
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
                        label={`${t('form:input-label-sku')}*`}
                        {...register(`variation_options.${fieldIndex}.sku`, { required: true })}
                        error={t(errors.variation_options?.[fieldIndex]?.sku?.message)}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                      <Input
                        label={`${t('form:input-label-quantity')}*`}
                        type="number"
                        {...register(`variation_options.${fieldIndex}.quantity`, { required: true })}
                        error={t(errors.variation_options?.[fieldIndex]?.quantity?.message)}
                        variant="outline"
                        className="mb-2"
                        style={{ width: '70px', height: '40px' }}
                      />
                      <div className="mb-2" style={{ width: '120px', height: '30px' }}>
                        <Label>Upload an image</Label>
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
                              acceptFile={true}
                              helperText={t('form:text-upload-digital-file')}
                              defaultValue={{}}
                            />
                            <ValidationError
                              message={t(errors?.variation_options?.[fieldIndex]?.digital_file_input?.message)}
                            />
                            <input
                              type="hidden"
                              {...register(`variation_options.${fieldIndex}.digital_file`)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <Checkbox
                          {...register(`variation_options.${fieldIndex}.is_disable`)}
                          error={t(errors.variation_options?.[fieldIndex]?.is_disable?.message)}
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
                    append({ attribute: '', value: [], name: '', price: '', sale_price: '', sku: '', quantity: '', image: '', is_digital: false, is_disable: false });
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
        attribute: item.attribute.name,
        values: item.value,
      }))
    : [{ attribute: cartesianProduct.attribute.name, values: cartesianProduct.value }];
 
  useEffect(() => {
    setValue(`variation_options.${index}.title`, title);
    setValue(`variation_options.${index}.options`, options);
  }, [fieldAttributeValue, setValue, index, title, options]);
 
  return (
    <>
      <input {...register(`variation_options.${index}.title`)} type="hidden" />
      <input {...register(`variation_options.${index}.options`)} type="hidden" />
    </>
  );
};