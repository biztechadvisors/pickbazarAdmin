import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Vacancy } from '@/types';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import { useEffect } from 'react';
import {
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
} from '@/data/vacancies'; // Import vacancy queries
import { title } from 'process';
import { values } from 'lodash';

const defaultValues = {
  title: '',
  description: '',
  employmentType: '',
  salaryRange: '',
  locationId: 0,
  shopId: 0,
  careerId: undefined, // Optional
};

type IProps = {
  initialValues?: Vacancy | null;
  locations: Array<{ id: number; title: string }>; // Adjust according to your location data structure
};

export default function CreateOrUpdateVacancyForm({
  initialValues,
  locations,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: me } = useMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Vacancy>({
    shouldUnregister: true,
    defaultValues: initialValues ?? defaultValues,
  });

  const shopId = me?.shop_id;

  const { mutate: createVacancy, isLoading: creating } =
    useCreateVacancyMutation(shopId);
  const { mutate: updateVacancy, isLoading: updating } =
    useUpdateVacancyMutation(shopId);

  // Populate the form with initial values if provided
  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title,
        description: initialValues.description,
        employmentType: initialValues.employmentType,
        salaryRange: initialValues.salaryRange,
        locationId: initialValues.locationId,
        shopId: initialValues.shopId,
        careerId: initialValues.careerId,
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (values: Vacancy) => {
    console.log('Form values:', values); // Log the form values on submit
    if (initialValues) {
      updateVacancy({
        id: initialValues.id,
        ...values,
      });
    } else {
      createVacancy({
        ...values,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-vacancy')}
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
          <Input
            label={t('form:input-label-employment-type')}
            {...register('employmentType')}
            error={t(errors.employmentType?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-salary-range')}
            {...register('salaryRange')}
            error={t(errors.salaryRange?.message!)}
            variant="outline"
            className="mb-5"
          />
          <select {...register('locationId')} className="mb-5">
            <option value="">{t('form:select-location')}</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.title}
              </option>
            ))}
          </select>
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
          {t('form:form-title-vacancy')}
        </Button>
      </div>
    </form>
  );
}
