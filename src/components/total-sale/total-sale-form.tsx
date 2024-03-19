import { Controller, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './total-sale-validation-schema';
import ColumnChart from '@/components/widgets/column-chart';
import Select from '../ui/select/select';
import { useEffect, useState } from 'react';
import { Type } from '@/types';
import { useMeQuery } from '@/data/user';
import { useAnalyticsCustomer, useAnalyticsDealer, useAnalyticsMutation } from '@/data/analytics';

type FormValues = {
  name?: string | null;
  selectRegion?: String | null;
  selectCustomer?: String | null;
  selectDealer?: String | null;
};

const data = {
  "optionRegion": [
    { "value": "Andhra Pradesh", "label": "Andhra Pradesh" },
    { "value": "Arunachal Pradesh", "label": "Arunachal Pradesh" },
    { "value": "Assam", "label": "Assam" },
    { "value": "Bihar", "label": "Bihar" },
    { "value": "Chhattisgarh", "label": "Chhattisgarh" },
    { "value": "Goa", "label": "Goa" },
    { "value": "Gujarat", "label": "Gujarat" },
    { "value": "Haryana", "label": "Haryana" },
    { "value": "Himachal Pradesh", "label": "Himachal Pradesh" },
    { "value": "Jharkhand", "label": "Jharkhand" },
    { "value": "Karnataka", "label": "Karnataka" },
    { "value": "Kerala", "label": "Kerala" },
    { "value": "Madhya Pradesh", "label": "Madhya Pradesh" },
    { "value": "Maharashtra", "label": "Maharashtra" },
    { "value": "Manipur", "label": "Manipur" },
    { "value": "Meghalaya", "label": "Meghalaya" },
    { "value": "Mizoram", "label": "Mizoram" },
    { "value": "Nagaland", "label": "Nagaland" },
    { "value": "Odisha", "label": "Odisha" },
    { "value": "Punjab", "label": "Punjab" },
    { "value": "Rajasthan", "label": "Rajasthan" },
    { "value": "Sikkim", "label": "Sikkim" },
    { "value": "Tamil Nadu", "label": "Tamil Nadu" },
    { "value": "Telangana", "label": "Telangana" },
    { "value": "Tripura", "label": "Tripura" },
    { "value": "Uttar Pradesh", "label": "Uttar Pradesh" },
    { "value": "Uttarakhand", "label": "Uttarakhand" },
    { "value": "West Bengal", "label": "West Bengal" }
  ],
  
};

const optionRegion = data.optionRegion;

type IProps = {
  initialValues?: Type | null;
};

export default function CreateOrUpdateTotalSaleForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    setValue,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(typeValidationSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  const { data } = useMeQuery();
  const { mutate: getAnalytics, data: getAnalyticsData } = useAnalyticsMutation()
  const { data: customer } = useAnalyticsCustomer(data?.id)
  const [allData, setAllData] = useState<any>();
  const [checkRegion, setCheckRegion] = useState<boolean>(false);
  const [checkCustomer, setCheckCustomer] = useState<boolean>(false);
  const [checkDealer, setCheckDealer] = useState<boolean>(false);

  const { data:dealer } = useAnalyticsDealer(data?.id)

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

  useEffect(() => {
    const input = {
      customerId: allData?.id ? allData.id : data?.id,
      state: allData?.value
    }
    getAnalytics(input)
  }, [allData, data,]);

  const handleSelectCustomerChange = (selectedOption: any, field: any) => {
    setAllData(selectedOption);
    setValue('selectRegion', null);
    setValue('selectDealer', null);
    setValue('selectCustomer', null);
    field.onChange(selectedOption);
  };

  let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  if (!!getAnalyticsData?.totalYearSaleByMonth?.length) {
    salesByYear = getAnalyticsData.totalYearSaleByMonth.map((item: any) =>
      item.total.toFixed(2)
    );
  }

  const onSubmit = (values: FormValues) => {
    const input = {
      language: router.locale,
      name: values.name!,
    };
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
                  onChange={(selectedOption: any) => (handleSelectCustomerChange(selectedOption, field))}
                />
              )}
            />
          </Card>
          <Card className="w-full mt-5">
            <label htmlFor="selectCustomer" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale of Customer​"}</label>
            <Controller
              name="selectCustomer"
              control={control}
              render={({ field }) => (
                <Select
                  id="selectCustomer"
                  value={field.value}
                  options={customer?.map((c: { userId: any; name: any; }) => ({ label: c.name, id: c.userId }))}
                  placeholder={t('Select Customer')}
                  onChange={(selectedOption: any) => (handleSelectCustomerChange(selectedOption, field))}
                />
              )}
            />
          </Card>

          <Card className="w-full mt-5">
            <label htmlFor="selectDealer" className='mb-3 block text-sm font-semibold leading-none text-body-dark'>{"Total sale of Dealer​"}</label>
            <Controller
              name="selectDealer"
              control={control}
              render={({ field }) => (
                <Select
                  id="selectDealer"
                  options={dealer?.map((c: { userId: any; name: any; }) => ({ label: c.name, id: c.userId }))}
                  placeholder={t('Select Dealer')}
                  value={field.value}
                  onChange={(selectedOption: any) => (handleSelectCustomerChange(selectedOption, field))}
                />
              )}
            />
          </Card>
        </div>
      </form>

      <h1 className="text-xl font-bold text-heading m-10">
        {t(`Total Sale :- ${getAnalyticsData && getAnalyticsData?.totalRevenue || "0"}₹`)}
      </h1>

      <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
        <ColumnChart
          widgetTitle={t('common:sale-history')}
          colors={['#03D3B5']}
          series={salesByYear}
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

