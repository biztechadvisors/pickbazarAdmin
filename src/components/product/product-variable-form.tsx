import Input from '@/components/ui/input';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Title from '@/components/ui/title';
import Checkbox from '@/components/ui/checkbox/checkbox';
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
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const upload_max_filesize = options?.server_info?.upload_max_filesize / 1024;

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
  // This field array will keep all the attribute dropdown fields
  const { fields, append, remove } = useFieldArray({
    shouldUnregister: true,
    control,
    name: 'variations',
  });
  const variations = watch('variations');
  const cartesianProduct = getCartesianProduct(getValues('variations'));
  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <Description
        title={t('form:form-title-variation-product-info')}
        details={`${
          initialValues
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
            {fields?.map((field: any, index: number) => {
              return (
                <div
                  key={field.id}
                  className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <Title className="mb-0">
                      {t('form:form-title-options')} {index + 1}
                    </Title>
                    <button
                      onClick={() => remove(index)}
                      type="button"
                      className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                    >
                      {t('form:button-label-remove')}
                    </button>
                  </div>

                  <div className="grid grid-cols-fit gap-5">
                    <div className="mt-5">
                      <Label>{t('form:input-label-attribute-name')}*</Label>
                      <SelectInput
                        name={`variations.${index}.attribute`}
                        control={control}
                        defaultValue={field.attribute}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        options={filterAttributes(attributes, variations)!}
                        isLoading={loading}
                      />
                    </div>

                    <div className="col-span-2 mt-5">
                      <Label>{t('form:input-label-attribute-value')}*</Label>
                      <SelectInput
                        isMulti
                        name={`variations.${index}.value`}
                        control={control}
                        defaultValue={field.value}
                        getOptionLabel={(option: any) => option.value}
                        getOptionValue={(option: any) => option.id}
                        options={watch(`variations.${index}.attribute`)?.values}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-5 md:px-8">
            <Button
              disabled={fields.length === attributes?.length}
              onClick={(e: any) => {
                e.preventDefault();
                append({ attribute: '', value: [] });
              }}
              type="button"
            >
              {t('form:button-label-add-option')}
            </Button>
          </div>

          {/* Preview generation section start */}
          {!!cartesianProduct?.length && (
            <div className="mt-5 border-t border-dashed border-border-200 pt-5 md:mt-8 md:pt-8">
    <Title className="mb-0 px-5 text-center text-lg uppercase md:px-8">
      {cartesianProduct?.length} {t('form:total-variation-added')}
    </Title>
    <div className="flex flex-wrap justify-start">
      {cartesianProduct.map((fieldAttributeValue: any, index: number) => (
        <div
          key={`fieldAttributeValues-${index}`}
          className="flex flex-col items-start border-b border-dashed border-border-200 p-5 last:mb-8 last:border-0 md:p-8 md:last:pb-0 mx-2 my-2"
style={{height:'250px'}}
>
          <Title className="mb-2 !text-lg">
            {t('form:form-title-variant')}:{' '}
            <span className="font-normal text-blue-600">
              {Array.isArray(fieldAttributeValue)
                ? fieldAttributeValue?.map((a) => a.value).join('/')
                : fieldAttributeValue.value}
            </span>
          </Title>
          <TitleAndOptionsInput
            register={register}
            setValue={setValue}
            index={index}
            fieldAttributeValue={fieldAttributeValue}
          />

          <input {...register(`variation_options.${index}.id`)} type="hidden" />

          <div className="flex flex-wrap gap-2">
            <Input
              label={`${t('form:input-label-price')}*`}
              type="number"
              {...register(`variation_options.${index}.price`)}
              error={t(errors.variation_options?.[index]?.price?.message)}
              variant="outline"
              className="mb-2"
              style={{width:'70px',height:'40px'}}
            />
            <Input
              label={t('form:input-label-sale-price')}
              // label='sale'
              type="number"
              {...register(`variation_options.${index}.sale_price`)}
              error={t(errors.variation_options?.[index]?.sale_price?.message)}
              variant="outline"
              className="mb-2"
              style={{width:'70px',height:'40px'}}
            />
            <Input
              label={`${t('form:input-label-sku')}*`}
              note={Config.enableMultiLang ? `${t('form:input-note-multilang-sku')}` : ''}
              {...register(`variation_options.${index}.sku`)}
              error={t(errors.variation_options?.[index]?.sku?.message)}
              variant="outline"
              className="mb-2"
              style={{width:'70px',height:'40px'}}
            />
            <Input
              label={`${t('form:input-label-quantity')}*`}
              type="number"
              {...register(`variation_options.${index}.quantity`)}
              error={t(errors.variation_options?.[index]?.quantity?.message)}
              variant="outline"
              className="mb-2"
              style={{width:'70px',height:'40px'}}
            />
             <div className="mb-2" style={{width:'120px',height:'30px'}}>
            <Label>
              {/* {t('form:input-label-image')}  */}
              {' Upload an image  '}
              {/* {upload_max_filesize} {'MB '} */}
            </Label>
            <FileInput
              name={`variation_options.${index}.image`}
              control={control}
              multiple={false}
            />
          </div>

          </div>
                   <div className="mb-2">
            <Checkbox
              {...register(`variation_options.${index}.is_digital`)}
              label={t('form:input-label-is-digital')}
            />
            {!!watch(`variation_options.${index}.is_digital`) && (
              <div className="mt-2">
                <Label>{t('form:input-label-digital-file')}</Label>
                <FileInput
                  name={`variation_options.${index}.digital_file_input`}
                  control={control}
                  multiple={false}
                  acceptFile={true}
                  helperText={t('form:text-upload-digital-file')}
                  defaultValue={{}}
                />
                <ValidationError
                  message={t(errors?.variation_options?.[index]?.digital_file_input?.message)}
                />
                <input
                  type="hidden"
                  {...register(`variation_options.${index}.digital_file`)}
                />
              </div>
            )}
          </div>
          <div className="mb-2">
            <Checkbox
              {...register(`variation_options.${index}.is_disable`)}
              error={t(errors.variation_options?.[index]?.is_disable?.message)}
              label={t('form:input-label-disable-variant')}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        </div>
      </Card>
    </div>
  );
}

export const TitleAndOptionsInput = ({
  fieldAttributeValue,
  index,
  setValue,
  register,
}: any) => {
  const title = Array.isArray(fieldAttributeValue)
    ? fieldAttributeValue.map((a) => a.value).join('/')
    : fieldAttributeValue.value;
  const options = Array.isArray(fieldAttributeValue)
    ? JSON.stringify(fieldAttributeValue)
    : JSON.stringify([fieldAttributeValue]);
  useEffect(() => {
    setValue(`variation_options.${index}.title`, title);
    setValue(`variation_options.${index}.options`, options);
  }, [fieldAttributeValue]);
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

// =================================


// import Input from '@/components/ui/input';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import Label from '@/components/ui/label';
// import Title from '@/components/ui/title';
// import Checkbox from '@/components/ui/checkbox/checkbox';
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
// import { Controller } from 'react-hook-form';

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
//   const thirdDropdownValue = watch('variations.2.value');

//   // Generate the cartesian product based on the selected values
//   // const cartesianProduct = getCartesianProduct(getValues('variations'), thirdDropdownValue);
//   const cartesianProduct = getCartesianProduct(getValues('variations'));
//   return (
//     <div className="my-5 flex flex-wrap sm:my-8">
//       <Description
//         title={t('form:form-title-variation-product-info')}
//         details={`${
//           initialValues
//             ? t('form:item-description-update')
//             : t('form:item-description-choose')
//         } ${t('form:form-description-variation-product-info')}`}
//         className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//       />
//       <Card className="w-full p-0 sm:w-8/12 md:w-2/3 md:p-0">
//         <div className="mb-5 border-t border-dashed border-border-200 md:mb-8">
//           <Title className="mt-8 mb-0 px-5 text-center text-lg uppercase md:px-8">
//             {t('form:form-title-options')}
//           </Title>
//           <div>
//   {fields?.map((field: any, index: number) => {
//     const attributeName = watch(`variations.${index}.attribute`);
//     const attributeValue = watch(`variations.${index}.value`);
//     const selectedValues = watch(`variations.${index}.value`); // Watch the selected values from each field

//     // Check if both attribute name and value are selected
//     const isBothSelected = attributeName && attributeValue?.length > 0;

//     // Fetch options based on the selected value for each field
//     const additionalValueOptions = attributeName ? attributeName.values : [];

//     return (
//       <div
//         key={field.id}
//         className="border-b border-dashed border-border-200 p-5 last:border-0 md:p-8"
//       >
//         <div className="flex items-center justify-between">
//           <Title className="mb-0">
//             {t('form:form-title-options')} {index + 1}
//           </Title>
//           <button
//             onClick={() => remove(index)}
//             type="button"
//             className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
//           >
//             {t('form:button-label-remove')}
//           </button>
//         </div>

//         <div className="grid grid-cols-fit gap-5">
//           <div className="mt-5">
//             <Label>{t('form:input-label-attribute-name')}*</Label>
//             <SelectInput
//               name={`variations.${index}.attribute`}
//               control={control}
//               defaultValue={field.attribute}
//               getOptionLabel={(option: any) => option.name}
//               getOptionValue={(option: any) => option.id}
//               options={filterAttributes(attributes, variations)!}
//               isLoading={loading}
//             />
//           </div>

//           <div className="col-span-2 mt-5">
//             <Label>{t('form:input-label-attribute-value')}*</Label>
//             <Controller
//               name={`variations.${index}.value`}
//               control={control}
//               defaultValue={field.value}
//               render={({ field }) => (
//                 <SelectInput
//                   isMulti
//                   {...field}
//                   getOptionLabel={(option: any) => option.value}
//                   getOptionValue={(option: any) => option.id}
//                   options={attributeName?.values || []}
//                 />
//               )}
//             />
//           </div>

//           Conditional rendering for additional SelectInput
//           {isBothSelected && (
//             <div className="col-span-2 mt-5">
//               <Label>Variantt</Label>
//               <Controller
//                 name={`variations.${index}.additionalValue`}
//                 control={control}
//                 defaultValue={field.additionalValue}
//                 render={({ field }) => (
//                   <SelectInput
//                     {...field}
//                     getOptionLabel={(option: any) => option.value}
//                     getOptionValue={(option: any) => option.id}
//                     options={selectedValues}
//                   />
//                 )}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   })}
//          </div>



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
//           {/* {thirdDropdownValue && (
//             <div className="px-5 md:px-8"> */}
//           {/* Preview generation section start */}
//          {!!cartesianProduct?.length && (
//   <div className="mt-5 border-t border-dashed border-border-200 pt-5 md:mt-8 md:pt-8 ">
//     <Title className="mb-0 px-5 text-center text-lg uppercase md:px-8">
//       {cartesianProduct?.length} {t('form:total-variation-added')}
//     </Title>
//     <div className="flex flex-wrap justify-start">
//       {cartesianProduct.map((fieldAttributeValue: any, index: number) => (
//         <div
//           key={`fieldAttributeValues-${index}`}
//           className="flex flex-col items-start border-b border-dashed border-border-200 p-5 last:mb-8 last:border-0 md:p-8 md:last:pb-0 mx-2 my-2"
//         >
//           <Title className="mb-2 !text-lg">
//             {t('form:form-title-variant')}:{' '}
//             <span className="font-normal text-blue-600">
//               {Array.isArray(fieldAttributeValue)
//                 ? fieldAttributeValue?.map((a) => a.value).join('/')
//                 : fieldAttributeValue.value}
//             </span>
//           </Title>
//           <TitleAndOptionsInput
//             register={register}
//             setValue={setValue}
//             index={index}
//             fieldAttributeValue={fieldAttributeValue}
//           />

//           <input {...register(`variation_options.${index}.id`)} type="hidden" />

//           <div className="flex flex-wrap gap-2">
//             <Input
//               label={`${t('form:input-label-price')}*`}
//               type="number"
//               {...register(`variation_options.${index}.price`)}
//               error={t(errors.variation_options?.[index]?.price?.message)}
//               variant="outline"
//               className="mb-2"
//               style={{width:'20px'}}
//             />
//             <Input
//               // label={t('form:input-label-sale-price')}
//               label='sale'
//               type="number"
//               {...register(`variation_options.${index}.sale_price`)}
//               error={t(errors.variation_options?.[index]?.sale_price?.message)}
//               variant="outline"
//               className="mb-2"
//               style={{width:'20px'}}
//             />
//             <Input
//               label={`${t('form:input-label-sku')}*`}
//               note={Config.enableMultiLang ? `${t('form:input-note-multilang-sku')}` : ''}
//               {...register(`variation_options.${index}.sku`)}
//               error={t(errors.variation_options?.[index]?.sku?.message)}
//               variant="outline"
//               className="mb-2"
//               style={{width:'20px'}}
//             />
//             <Input
//               label={`${t('form:input-label-quantity')}*`}
//               type="number"
//               {...register(`variation_options.${index}.quantity`)}
//               error={t(errors.variation_options?.[index]?.quantity?.message)}
//               variant="outline"
//               className="mb-2"
//               style={{width:'20px'}}
//             />
//              <div className="mb-2" style={{width:'250px',height:'10px'}}>
//             <Label>
//               {t('form:input-label-image')} 
//               {' and size should not be more than '}
//               {upload_max_filesize} {'MB '}
//             </Label>
//             <FileInput
//               name={`variation_options.${index}.image`}
//               control={control}
//               multiple={false}
//             />
//           </div>

//           </div>
//                    <div className="mb-2">
//             <Checkbox
//               {...register(`variation_options.${index}.is_digital`)}
//               label={t('form:input-label-is-digital')}
//             />
//             {!!watch(`variation_options.${index}.is_digital`) && (
//               <div className="mt-2">
//                 <Label>{t('form:input-label-digital-file')}</Label>
//                 <FileInput
//                   name={`variation_options.${index}.digital_file_input`}
//                   control={control}
//                   multiple={false}
//                   acceptFile={true}
//                   helperText={t('form:text-upload-digital-file')}
//                   defaultValue={{}}
//                 />
//                 <ValidationError
//                   message={t(errors?.variation_options?.[index]?.digital_file_input?.message)}
//                 />
//                 <input
//                   type="hidden"
//                   {...register(`variation_options.${index}.digital_file`)}
//                 />
//               </div>
//             )}
//           </div>
//           <div className="mb-2">
//             <Checkbox
//               {...register(`variation_options.${index}.is_disable`)}
//               error={t(errors.variation_options?.[index]?.is_disable?.message)}
//               label={t('form:input-label-disable-variant')}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//           {/* </div> */}
//           {/* )} */}
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

