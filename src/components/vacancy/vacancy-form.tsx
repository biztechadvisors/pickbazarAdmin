import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Vacancy } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMeQuery } from '@/data/user';
import { useState, useEffect } from 'react';
import {
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useVacancyQuery,
} from '@/data/vacancies'; // Import vacancy queries

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
};

export default function CreateOrUpdateVacancyForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: me } = useMeQuery();
  const { id } = router.query; // Get ID from URL

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Add reset to manually update the form values
  } = useForm<Vacancy>({
    shouldUnregister: true,
    defaultValues: initialValues ?? defaultValues,
  });

  const shopId = me?.shop_id;

  const { mutate: createVacancy, isLoading: creating } =
    useCreateVacancyMutation(shopId);
  const { mutate: updateVacancy, isLoading: updating } =
    useUpdateVacancyMutation(shopId);

  // Fetch existing vacancy details if `id` is present
  const {
    data: vacancyData,
    error: vacancyError,
    isLoading: isVacancyLoading,
  } = useVacancyQuery(id as string);

  // Update form with initial values when vacancy data is fetched
  useEffect(() => {
    if (vacancyData && id) {
      reset({
        title: vacancyData.title,
        description: vacancyData.description,
        employmentType: vacancyData.employmentType,
        salaryRange: vacancyData.salaryRange,
        locationId: vacancyData.locationId,
        shopId: vacancyData.shopId,
        careerId: vacancyData.careerId,
      });
    }
  }, [vacancyData, reset, id]);

  const onSubmit = async (values: Vacancy) => {
    if (id && initialValues) {
      // If updating an existing vacancy
      updateVacancy({
        id: id as string, // Use the `id` from URL params
        ...values,
      });
    } else {
      // If creating a new vacancy
      createVacancy({
        ...values,
      });
    }
  };

  if (isVacancyLoading) return <p>Loading...</p>;
  if (vacancyError)
    return <p>Error fetching vacancy data: {vacancyError.message}</p>;

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
          <Input
            label={t('form:input-label-location-id')}
            type="number"
            {...register('locationId')}
            error={t(errors.locationId?.message!)}
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
          {initialValues || id
            ? t('form:button-label-update')
            : t('form:button-label-add')}{' '}
          {t('form:form-title-vacancy')}
        </Button>
      </div>
    </form>
  );
}
