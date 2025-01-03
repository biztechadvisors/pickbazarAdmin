// import Button from '@/components/ui/button';
// import Input from '@/components/ui/input';
// import Label from '@/components/ui/label';
// import Radio from '@/components/ui/radio/radio';
// import TextArea from '@/components/ui/text-area';
// import { useTranslation } from 'next-i18next';
// import * as yup from 'yup';
// import { useModalState } from '@/components/ui/modal/modal.context';
// import { Form } from '@/components/ui/form/form';
// import { AddressType, GoogleMapLocation } from '@/types';
// import { useSettings } from '@/contexts/settings.context';
// import { Controller } from 'react-hook-form';
// import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
// import ValidationError from '../ui/validation-error';
// import SelectInput from '../ui/select-input';
// import { useState } from 'react';

// type FormValues = {
//   title: string;
//   type: string;
//   address: {
//     country: string;
//     city: string;
//     state: string;
//     zip: string;
//     street_address: string;
//   };
//   location: GoogleMapLocation;
// };

// const addressSchema = yup.object().shape({
//   type: yup
//     .string()
//     .oneOf([AddressType.Billing, AddressType.Shipping])
//     .required('error-type-required'),
//   title: yup.string().required('error-title-required'),
//   address: yup.object().shape({
//     country: yup.string().required('error-country-required'),
//     city: yup.string().required('error-city-required'),
//     // state: yup.string().required('error-state-required'),
//     state: yup.object().shape({
//       value: yup.string().required('error-state-name-required'),
//     }).required('error-state-required'),
//     zip: yup.string().required('error-zip-required'),
//     street_address: yup.string().required('error-street-required'),
//   }),
// });

// // console.log('addressSchema = ',addressSchema)

// const optionRegion = [
//   { value: "Andhra Pradesh", label: "Andhra Pradesh" },
//   { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
//   { value: "Assam", label: "Assam" },
//   { value: "Bihar", label: "Bihar" },
//   { value: "Chhattisgarh", label: "Chhattisgarh" },
//   { value: "Goa", label: "Goa" },
//   { value: "Gujarat", label: "Gujarat" },
//   { value: "Haryana", label: "Haryana" },
//   { value: "Himachal Pradesh", label: "Himachal Pradesh" },
//   { value: "Jharkhand", label: "Jharkhand" },
//   { value: "Karnataka", label: "Karnataka" },
//   { value: "Kerala", label: "Kerala" },
//   { value: "Madhya Pradesh", label: "Madhya Pradesh" },
//   { value: "Maharashtra", label: "Maharashtra" },
//   { value: "Manipur", label: "Manipur" },
//   { value: "Meghalaya", label: "Meghalaya" },
//   { value: "Mizoram", label: "Mizoram" },
//   { value: "Nagaland", label: "Nagaland" },
//   { value: "Odisha", label: "Odisha" },
//   { value: "Punjab", label: "Punjab" },
//   { value: "Rajasthan", label: "Rajasthan" },
//   { value: "Sikkim", label: "Sikkim" },
//   { value: "Tamil Nadu", label: "Tamil Nadu" },
//   { value: "Telangana", label: "Telangana" },
//   { value: "Tripura", label: "Tripura" },
//   { value: "Uttar Pradesh", label: "Uttar Pradesh" },
//   { value: "Uttarakhand", label: "Uttarakhand" },
//   { value: "West Bengal", label: "West Bengal" }
// ];

// const AddressForm: React.FC<any> = ({ onSubmit }) => {
//   const { t } = useTranslation('common');
//   const { useGoogleMap } = useSettings();
//   const {
//     data: { address, type },
//   } = useModalState();

//   const [getState, setState] = useState(address?.address?.state)


//   return (
//     <div className="min-h-screen p-5 bg-light sm:p-8 md:min-h-0 md:rounded-xl">
//       <h1 className="mb-4 text-lg font-semibold text-center text-heading sm:mb-6">
//         {address ? t('text-update') : t('text-add-new')} {t('text-address')}
//       </h1>
//       <Form<FormValues>
//         onSubmit={(data) => {
//           const dataji = {
//             title: data.title,
//             type: data.type,
//             address: {
//               country: data.address.country,
//               city: data.address.city,
//               state: data.address.state.value,
//               zip: data.address.zip,
//               street_address: data.address.street_address,
//             },
//             location: data?.address?.location
//           }
//           onSubmit(dataji);
//         }}

//         className="grid h-full grid-cols-2 gap-5"
//         //@ts-ignore
//         validationSchema={addressSchema}
//         options={{
//           shouldUnregister: true,
//           defaultValues: {
//             title: address?.title ?? '',
//             type: address?.type ?? type,
//             address: {
//               city: address?.address?.city ?? '',
//               country: address?.address?.country ?? '',
//               state: address?.address?.state ?? '',
//               zip: address?.address?.zip ?? '',
//               street_address: address?.address?.street_address ?? '',
//               ...address?.address,
//             },
//             location: address?.location ?? '',
//           },
//         }}
//         resetValues={{
//           title: address?.title ?? '',
//           type: address?.type ?? type,
//           ...(address?.address && address),
//         }}
//       >
//         {({
//           register,
//           control,
//           getValues,
//           setValue,
//           formState: { errors },
//         }) => (
//           <>
//             <div>
//               <Label>{t('text-type')}</Label>
//               <div className="flex items-center space-s-4">
//                 <Radio
//                   id="billing"
//                   {...register('type')}
//                   type="radio"
//                   value={AddressType.Billing}
//                   label={t('text-billing')}
//                 />
//                 <Radio
//                   id="shipping"
//                   {...register('type')}
//                   type="radio"
//                   value={AddressType.Shipping}
//                   label={t('text-shipping')}
//                 />
//               </div>
//             </div>

//             <Input
//               label={t('text-title')}
//               {...register('title')}
//               error={t(errors.title?.message!)}
//               variant="outline"
//               className="col-span-2"
//             />

//             {useGoogleMap && (
//               <div className="col-span-2">
//                 <Label>{t('text-location')}</Label>
//                 <Controller
//                   control={control}
//                   name="location"
//                   render={({ field: { onChange } }) => (
//                     <GooglePlacesAutocomplete
//                       icon={true}
//                       onChange={(location: any) => {
//                         onChange(location);
//                         setValue('address.country', location?.country);
//                         setValue('address.city', location?.city);
//                         setValue('address.state', location?.state);
//                         setValue('address.zip', location?.zip);
//                         setValue(
//                           'address.street_address',
//                           location?.street_address
//                         );
//                       }}
//                       data={getValues('location')!}
//                     />
//                   )}
//                 />
//               </div>
//             )}

//             <Input
//               label={t('text-country')}
//               {...register('address.country')}
//               error={t(errors.address?.country?.message!)}
//               variant="outline"
//             />

//             <Input
//               label={t('text-city')}
//               {...register('address.city')}
//               error={t(errors.address?.city?.message!)}
//               variant="outline"
//             />

//             <div>
//               <Label>{t('text-state')}</Label>
//               <SelectInput
//                 options={optionRegion}
//                 placeholder={t('Select')}
//                 getOptionLabel={(option: any) => `${option?.label}`}
//                 getOptionValue={(option: any) => option}
//                 control={control}
//                 name={'address.state'}
//                 defaultValue={[]} />
//               <ValidationError message={errors.address?.state?.message} />
//             </div>

//             <Input
//               label={t('text-zip')}
//               {...register('address.zip')}
//               error={t(errors.address?.zip?.message!)}
//               variant="outline"
//             />

//             <TextArea
//               label={t('text-street-address')}
//               {...register('address.street_address')}
//               error={t(errors.address?.street_address?.message!)}
//               variant="outline"
//               className="col-span-2"
//             />

//             <Button className="w-full col-span-2">
//               {address ? t('text-update') : t('text-save')} {t('text-address')}
//             </Button>
//           </>
//         )}
//       </Form>
//     </div>
//   );
// };

// export default AddressForm;


import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/form/form';
import { AddressType, GoogleMapLocation } from '@/types';
import { useSettings } from '@/contexts/settings.context';
import { Controller } from 'react-hook-form';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import ValidationError from '../ui/validation-error';
import SelectInput from '../ui/select-input';
import { useState } from 'react';

type FormValues = {
  title: string;
  type: string;
  address: {
    country: string;
    city: string;
    state: string; // Keep state as a string
    zip: string;
    street_address: string;
  };
  location: GoogleMapLocation; // Correctly defined at this level
};

const addressSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf([AddressType.Billing, AddressType.Shipping])
    .required('error-type-required'),
  title: yup.string().required('error-title-required'),
  address: yup.object().shape({
    country: yup.string().required('error-country-required'),
    city: yup.string().required('error-city-required'),
    state: yup.string().required('error-state-name-required'), // Change to string
    zip: yup.string().required('error-zip-required'),
    street_address: yup.string().required('error-street-required'),
  }),
});

const optionRegion = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" }
];

const AddressForm: React.FC<any> = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const { useGoogleMap } = useSettings();
  const {
    data: { address, type },
  } = useModalState();

  return (
    <div className="min-h-screen p-5 bg-light sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-4 text-lg font-semibold text-center text-heading sm:mb-6">
        {address ? t('text-update') : t('text-add-new')} {t('text-address')}
      </h1>
      <Form<FormValues>
        onSubmit={(data) => {
          const dataji = {
            title: data.title,
            type: data.type,
            address: {
              country: data.address.country,
              city: data.address.city,
              state: data.address.state, // Accessing state as a string
              zip: data.address.zip,
              street_address: data.address.street_address,
            },
            location: data.location, // Correctly access location here
          };
          onSubmit(dataji);
        }}
        className="grid h-full grid-cols-2 gap-5"
        //@ts-ignore
        validationSchema={addressSchema}
        options={{
          shouldUnregister: true,
          defaultValues: {
            title: address?.title ?? '',
            type: address?.type ?? type,
            address: {
              city: address?.address?.city ?? '',
              country: address?.address?.country ?? '',
              state: address?.address?.state ?? '', // Directly assign state as string
              zip: address?.address?.zip ?? '',
              street_address: address?.address?.street_address ?? '',
              ...address?.address,
            },
            location: address?.location ?? '', // Ensure default values are correctly set
          },
        }}
      >
        {({
          register,
          control,
          getValues,
          setValue,
          formState: { errors },
        }) => (
          <>
            <div>
              <Label>{t('text-type')}</Label>
              <div className="flex items-center space-s-4">
                <Radio
                  id="billing"
                  {...register('type')}
                  type="radio"
                  value={AddressType.Billing}
                  label={t('text-billing')}
                />
                <Radio
                  id="shipping"
                  {...register('type')}
                  type="radio"
                  value={AddressType.Shipping}
                  label={t('text-shipping')}
                />
              </div>
            </div>

            <Input
              label={t('text-title')}
              {...register('title')}
              error={t(errors.title?.message!)}
              variant="outline"
              className="col-span-2"
            />

            {useGoogleMap && (
              <div className="col-span-2">
                <Label>{t('text-location')}</Label>
                <Controller
                  control={control}
                  name="location"
                  render={({ field: { onChange } }) => (
                    <GooglePlacesAutocomplete
                      icon={true}
                      onChange={(location: any) => {
                        onChange(location);
                        setValue('address.country', location?.country);
                        setValue('address.city', location?.city);
                        setValue('address.state', location?.state); // Ensure this is a string
                        setValue('address.zip', location?.zip);
                        setValue(
                          'address.street_address',
                          location?.street_address
                        );
                      }}
                      data={getValues('location')!}
                    />
                  )}
                />
              </div>
            )}

            <Input
              label={t('text-country')}
              {...register('address.country')}
              error={t(errors.address?.country?.message!)}
              variant="outline"
            />

            <Input
              label={t('text-city')}
              {...register('address.city')}
              error={t(errors.address?.city?.message!)}
              variant="outline"
            />

            <div>
              <Label>{t('text-state')}</Label>
              <SelectInput
                options={optionRegion}
                placeholder={t('Select')}
                getOptionLabel={(option: any) => `${option?.label}`}
                getOptionValue={(option: any) => option}
                control={control}
                name={'address.state'}
                defaultValue={[]} />
              <ValidationError message={errors.address?.state?.message} />
            </div>

            <Input
              label={t('text-zip')}
              {...register('address.zip')}
              error={t(errors.address?.zip?.message!)}
              variant="outline"
            />

            <TextArea
              label={t('text-street-address')}
              {...register('address.street_address')}
              error={t(errors.address?.street_address?.message!)}
              variant="outline"
              className="col-span-2"
            />

            <Button className="w-full col-span-2">
              {address ? t('text-update') : t('text-save')} {t('text-address')}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default AddressForm;
