import Card from '@/components/common/card';
import AdminLayout from '@/components/layouts/admin';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import { useForm } from 'react-hook-form';
import { useCreateMutation } from '@/data/event';

type FormValues = {
  title: string;
  eventName: string;
  description: string;
  date: string;
  time: string;
  location: string;
  collaboration: string;
  shopId: number;
  imageIds: number[];
  image: any;
};

const EventCreate = () => {
  const { t } = useTranslation();
  const { mutate: createEvent } = useCreateMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      eventName: '',
      description: '',
      date: '',
      time: '',
      location: '',
      collaboration: '',
      shopId: 1,
      imageIds: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.image) {
      data.imageIds = [data.image.id];
    }

    createEvent(data); // Pass the form data to the mutation

    console.log('Form Data:', data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-image')}
            details={t('form:blog-image-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="image" control={control} multiple={false} />
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-event')}
            details={t('Create event')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Label>{t('form:input-label-title')}</Label>
            <Input
              type="text"
              {...register('title', { required: true })}
              variant="outline"
              className="mb-5"
            />
            {errors.title && <p className="text-red-500">Title is required.</p>}

            <Label>{t('form:input-label-event-name')}</Label>
            <Input
              type="text"
              {...register('eventName', { required: true })}
              variant="outline"
              className="mb-5"
            />
            {errors.eventName && (
              <p className="text-red-500">Event name is required.</p>
            )}

            <Label>{t('form:input-label-description')}</Label>
            <TextArea
              {...register('description', { required: true })}
              placeholder="Write your description here..."
              className="mb-5 h-40 w-full rounded-lg border border-gray-300 p-2"
            />
            {errors.description && (
              <p className="text-red-500">Description is required.</p>
            )}

            <Label>{t('form:input-label-date')}</Label>
            <Input
              type="date"
              {...register('date', { required: true })}
              variant="outline"
              className="mb-5"
            />
            {errors.date && <p className="text-red-500">Date is required.</p>}

            <Label>{t('form:input-label-time')}</Label>
            <Input
              type="datetime-local"
              {...register('time', { required: true })}
              variant="outline"
              className="mb-5"
            />
            {errors.time && <p className="text-red-500">Time is required.</p>}

            <Label>{t('form:input-label-location')}</Label>
            <Input
              type="text"
              {...register('location', { required: true })}
              variant="outline"
              className="mb-5"
            />
            {errors.location && (
              <p className="text-red-500">Location is required.</p>
            )}

            <Label>{t('form:input-label-collaboration')}</Label>
            <Input
              type="text"
              {...register('collaboration', { required: true })}
              variant="outline"
              className="mb-5"
            />
            {errors.collaboration && (
              <p className="text-red-500">Collaboration is required.</p>
            )}

            <Button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              {t('form:button-label-submit')}
            </Button>
          </Card>
        </div>
      </form>
    </>
  );
};

EventCreate.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

EventCreate.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default EventCreate;
