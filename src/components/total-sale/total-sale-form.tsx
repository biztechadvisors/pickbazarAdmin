// import Input from '@/components/ui/input';
// import { Controller, useFieldArray, useForm } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import { useRouter } from 'next/router';
// import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
// import { useTranslation } from 'next-i18next';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { typeValidationSchema } from './total-sale-validation-schema';
// import { useCreateTypeMutation, useUpdateTypeMutation } from '@/data/type';
// import ColumnChart from '@/components/widgets/column-chart';
// import Select from '../ui/select/select';
// import Radio from '../ui/radio/radio';
// import { useAnalyticsQuery } from '@/data/dashboard';
// import { useEffect, useState } from 'react';

// // const { data, isLoading: loading } = useAnalyticsQuery();
// // let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
// //   if (!!data?.totalYearSaleByMonth?.length) {
// //     salesByYear = data.totalYearSaleByMonth.map((item: any) =>
// //       item.total.toFixed(2)
// //     );
// //   }
// const dummySalesData = [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 0, 0];

// type FormValues = {
//   name?: string | null;
//   selectInput?: String | null;
//   selectCustomer?: String | null;
//   selectDealer?: String | null;
// };

// const optionRegion = [
//   { value: 'Indore', label: 'Indore', salesData: [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 10, 2, 0] },
//   { value: 'Bhopal', label: 'Bhopal', salesData: [2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 1, 0, 10, 1] },
//   { value: 'Dewas', label: 'Dewas', salesData: [3, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 1, 8] },
// ];

// const optionDealer = [
//   { value: 'Meta', label: 'Meta', salesData: [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 10, 2, 0] },
//   { value: 'GB', label: 'GB', salesData: [2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 1, 0, 10, 1] },
//   { value: 'MB', label: 'MB', salesData: [3, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 1, 8] },
// ];

// const optionCustomer = [
//   { value: 'Arman', label: 'Arman', salesData: [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 0, 0] },
//   { value: 'Ajay', label: 'Ajay', salesData: [2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 1, 0, 0, 1] },
//   { value: 'Ayush', label: 'Ayush', salesData: [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 1, 0] },
//   // Add more options as needed
// ];

// type IProps = {
//   initialValues?: Type | null;
// };
// export default function CreateOrUpdateTypeForm({ initialValues }: IProps) {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<FormValues>({
//     shouldUnregister: true,
//     resolver: yupResolver(typeValidationSchema),
//     defaultValues: {
//       ...initialValues,
//       // @ts-ignore
//     },
//   });

//   const { mutate: createType, isLoading: creating } = useCreateTypeMutation();
//   const { mutate: updateType, isLoading: updating } = useUpdateTypeMutation();
//   const [salesData, setSalesData] = useState<number[]>(dummySalesData);


//   const handleSelectCustomerChange = (selectedOption: any, field: any, optionNewData:any) => {
//     const selectedData = optionNewData.find((option: { value: any; }) => option.value === selectedOption.value);
//     if (selectedData) {
//       setSalesData(selectedData.salesData);
//     }
//     field.onChange(selectedOption);
//   };

//   const onSubmit = (values: FormValues) => {
//     const selectedOption = watch('selectInput');
//     const input = {
//       language: router.locale,
//       name: values.name!,
//       selectedOption: selectedOption!,
//     };

//     if (
//       !initialValues ||
//       !initialValues.translated_languages.includes(router.locale!)
//     ) {
//       createType({
//         ...input,
//         ...(initialValues?.slug && { slug: initialValues.slug }),
//       });
//     } else {
//       updateType({
//         ...input,
//         id: initialValues.id!,
//       });
//     }
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
//           <Card className="w-full mt-5">
//             <label htmlFor="selectInput" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale In Region​"}</label>
//             <Controller
//               name="selectInput"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   id="selectInput"
//                   // name={field.name}
//                   options={optionRegion}
//                   placeholder={t('Select Region')}
//                   value={field.value}
//                   onChange={(selectedOption: any) => handleSelectCustomerChange(selectedOption, field , optionRegion)}
//                 />
//               )}
//             />
//             <div className='mt-5'>Region :- Ex.. Indore​</div>
//           </Card>
//           <Card className="w-full mt-5">
//             <label htmlFor="selectCustomer" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale of Customer​"}</label>
//             <Controller
//               name="selectCustomer"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   id="selectCustomer"
//                   options={optionCustomer}
//                   placeholder={t('Select Customer')}
//                   value={field.value}
//                   onChange={(selectedOption: any) => handleSelectCustomerChange(selectedOption, field, optionCustomer)}
//                 />
//               )}
//             />
//             <div className='mt-5'>Customer :- Ex.. Ajay Shukla​​</div>
//           </Card>

//           <Card className="w-full mt-5">
//             <label htmlFor="selectInput" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale of Dealer​"}</label>
//             <Controller
//               name="selectInput"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   id="selectInput"
//                   // name={field.name}
//                   options={optionDealer}
//                   placeholder={t('Select Dealer')}
//                   value={field.value}
//                   onChange={(selectedOption: any) => handleSelectCustomerChange(selectedOption, field, optionDealer)}
//                 />
//               )}
//             />
//             <div className='mt-5'>Dealer :- Ex.. Ayush Nigam​​</div>
//           </Card>
//         </div>
//       </form>
//       <h1 className="text-xl font-bold text-heading m-10">
//         {t('Total Sale :- 450$')}
//       </h1>
//       <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
//         <ColumnChart
//           widgetTitle={t('common:sale-history')}
//           colors={['#03D3B5']}
//           // series={salesByYear}
//           series={salesData}
//           categories={[
//             t('common:january'),
//             t('common:february'),
//             t('common:march'),
//             t('common:april'),
//             t('common:may'),
//             t('common:june'),
//             t('common:july'),
//             t('common:august'),
//             t('common:september'),
//             t('common:october'),
//             t('common:november'),
//             t('common:december'),
//           ]}
//         />
//       </div>

//     </div>
//   );
// }


import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './total-sale-validation-schema';
import { useCreateTypeMutation, useUpdateTypeMutation } from '@/data/type';
import ColumnChart from '@/components/widgets/column-chart';
import Select from '../ui/select/select';
import Radio from '../ui/radio/radio';
import { useAnalyticsQuery } from '@/data/dashboard';
import { useState } from 'react';
import { usetotalSale } from '@/data/total-sale';

const dummySalesData = [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 0, 0];

type FormValues = {
  name?: string | null;
  selectRegion?: String | null;
  selectCustomer?: String | null;
  selectDealer?: String | null;
};

const data = {
  "optionRegion": [
    { "value": "Indore", "label": "Indore", "totalSale": "420", "salesData": [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 10, 2, 0] },
    { "value": "Bhopal", "label": "Bhopal", "totalSale": "300", "salesData": [2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 1, 0, 10, 1] },
    { "value": "Dewas", "label": "Dewas", "totalSale": "120", "salesData": [3, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 1, 8] }
  ],
  "optionDealer": [
    { "value": "Meta", "label": "Meta", "totalSale": "920", "salesData": [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 10, 2, 0] },
    { "value": "GB", "label": "GB", "totalSale": "820", "salesData": [2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 1, 0, 10, 1] },
    { "value": "MB", "label": "MB", "totalSale": "720", "salesData": [3, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 1, 8] }
  ],
  "optionCustomer": [
    { "value": "Arman", "label": "Arman", "totalSale": "1120", "salesData": [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 0, 0] },
    { "value": "Ajay", "label": "Ajay", "totalSale": "2220", "salesData": [2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 1, 0, 0, 1] },
    { "value": "Ayush", "label": "Ayush", "totalSale": "3320", "salesData": [1, 2, 2, 1.8, 2.2, 2.5, 3.0, 2.80, 3.20, 0, 1, 0] }
  ]
};

const optionRegion = data.optionRegion;
const optionDealer = data.optionDealer;
const optionCustomer = data.optionCustomer;

type IProps = {
  initialValues?: Type | null;
};

export default function CreateOrUpdateTypeForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(typeValidationSchema),
    defaultValues: {
      ...initialValues,
      // @ts-ignore
    },
  });

  const { mutate: createType, isLoading: creating } = useCreateTypeMutation();
  const { mutate: updateType, isLoading: updating } = useUpdateTypeMutation();
  const [allData, setAllData] = useState<any>();
  const [checkRegion, setCheckRegion] = useState<boolean>(false);
  const [checkCustomer, setCheckCustomer] = useState<boolean>(false);
  const [checkDealer, setCheckDealer] = useState<boolean>(false);
  const { data, isLoading, isError } = usetotalSale('92', '');
  console.log("data====", data)


  const handlecheckData = () => {
    if (checkRegion) {
        setCheckCustomer(false);
        setCheckDealer(false);
    } else if (checkCustomer) {
        setCheckRegion(false);
        setCheckDealer(false);
    } else if (checkDealer) {
        setCheckRegion(false);
        setCheckCustomer(false);
    }
};  



const handleSelectCustomerChange = (selectedOption: any, field: any, optionNewData: any) => {
  const selectedData = optionNewData.find((option: { value: any }) => option.value === selectedOption.value);
  setAllData(selectedData);

  // Reset values of the region and dealer fields when a customer is selected
  setValue('selectRegion', null);
  setValue('selectDealer', null);
  setValue('selectCustomer', null);

  field.onChange(selectedOption);
};


  const onSubmit = (values: FormValues) => {
    // const selectedOption = watch('selectRegion');
    // const selectedCustomer = watch('selectCustomer');
    const input = {
      language: router.locale,
      name: values.name!,
      // selectedOption: selectedOption!,
    };

    if (
      !initialValues ||
      !initialValues.translated_languages.includes(router.locale!)
    ) {
      createType({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
      });
    } else {
      updateType({
        ...input,
        id: initialValues.id!,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="w-full mt-5">
            <label htmlFor="selectRegion" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale In Region​"}</label>
            <Controller
              name="selectRegion"
              control={control}
              render={({ field }) => (
                <Select
                  id="selectRegion"
                  options={optionRegion}
                  placeholder={t('Select Region')}
                  value={field.value}
                  onChange={(selectedOption: any) => (handleSelectCustomerChange(selectedOption, field, optionRegion))}
                />
              )}
            />
            {optionRegion.find((option) => option.value === allData?.value) && (
              <div className='mt-5'>
                Region: - {allData.value}
                {/* {()=>setCheckRegion(true)}
                {()=>handlecheckData()} */}
              </div>
              
            )}


          </Card>
          <Card className="w-full mt-5">
            <label htmlFor="selectCustomer" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale of Customer​"}</label>
            <Controller
              name="selectCustomer"
              control={control}
              render={({ field }) => (
                <Select
                  id="selectCustomer"
                  options={optionCustomer}
                  placeholder={t('Select Customer')}
                  value={field.value}
                  onChange={(selectedOption: any) => ( handleSelectCustomerChange(selectedOption, field, optionCustomer))}
                />
              )}
            />

            {optionCustomer.find((option) => option.value === allData?.value) && (
              <div className='mt-5'>Customer :- {allData.value}
              {/* {()=>setCheckCustomer(true)}
                {()=>handlecheckData()} */}
              ​</div>
              
            )}
          </Card>

          <Card className="w-full mt-5">
            <label htmlFor="selectDealer" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale of Dealer​"}</label>
            <Controller
              name="selectDealer"
              control={control}
              render={({ field }) => (
                <Select
                  id="selectDealer"
                  options={optionDealer}
                  placeholder={t('Select Dealer')}
                  value={field.value}
                  onChange={(selectedOption: any) => ( handleSelectCustomerChange(selectedOption, field, optionDealer))}
                />
              )}
            />
            {optionDealer.find((option) => option.value === allData?.value) && (
              <div className='mt-5'>Dealer :- {allData.value}
              {/* {()=>setCheckDealer(true)}​
              {()=>handlecheckData()} */}
              ​</div>
            )}
          </Card>
        </div>
      </form>

      <h1 className="text-xl font-bold text-heading m-10">
        {t(`Total Sale :- ${allData && allData?.totalSale || "450"}$`)}
      </h1>

      <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
        <ColumnChart
          widgetTitle={t('common:sale-history')}
          colors={['#03D3B5']}
          series={allData && allData.salesData || dummySalesData}
          categories={[
            t('common:january'),
            t('common:february'),
            t('common:march'),
            t('common:april'),
            t('common:may'),
            t('common:june'),
            t('common:july'),
            t('common:august'),
            t('common:september'),
            t('common:october'),
            t('common:november'),
            t('common:december'),
          ]}
        />
      </div>
    </div>
  );
}

