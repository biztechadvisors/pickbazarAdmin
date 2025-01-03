import { useShopQuery } from '@/data/shop';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Description from '../ui/description';
import FileInput from '../ui/file-input';
import Card from '../common/card';
import Input from '../ui/input';
import TextArea from '../ui/text-area';
import Button from '../ui/button';
import { useRouter } from 'next/router';
import Alert from '../ui/alert';
import { animateScroll } from 'react-scroll';
import { useCreateEventMutation, useUpdateeventMutation } from '@/data/event';
import { useMeQuery } from '@/data/user';
import { useRegionsQuery } from '@/data/regions';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { Event } from '@/types';

function SelectRegion({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { data: meData } = useMeQuery();

  const ShopSlugName = 'hilltop-marble';
  // const { data: me } = useMeQuery()
   
  const { regions, error } = useRegionsQuery({
    code: meData?.managed_shop?.slug,
  });
  
  if (error) {
    console.error('Error fetching regions:', error);
  }
  return (
    <div className="mb-5">
      <Label>Select Region</Label>
      <SelectInput
        name="regions"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={regions?.items || []}
        isLoading={!regions} // Show loading state if regions data is not yet loaded
      />
      {/* <ValidationError message={t(errors.type?.message)} /> */}
    </div>
  );
}
 
export type FormValues = {
  title: string;
  eventName: string;
  description: string;
  date: string;
  time: string;
  location: string;
  collaboration: string;
  shopId: string | number;
  imageIds: number[];
  regionName: string;
  regions:any;
};

const defaultValues: FormValues = {
  title: '',
  eventName: '',
  description: '',
  date: '',
  time: '',
  location: '',
  collaboration: '',
  shopId: 0,
  imageIds: [],
  regionName: '',
  regions: '',
};
type IProps = {
  initialValues: Event | undefined;
};
const EventCreateOrUpdate = ({ initialValues }: IProps) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: meData } = useMeQuery();
  const {   query: { shop }, } = router;
  const { t } = useTranslation();
  const { data: shopData } = useShopQuery(
    { slug: shop as string, },
    { enabled: !!shop }
  );
  const shopId = initialValues?.shopId || meData?.shop_id || shopData?.id || 0;
  // const shopId = me?.shop_id ;
  // const shopId = shopData?.id || initialValues?.shopId;
console.log("shopId====",shopId)

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  // } = useForm<FormValues>({
  //   defaultValues: initialValues
  //     ? initialValues
  //     : {
  //         title: '',
  //         eventName: '',
  //         description: '',
  //         date: '',
  //         time: '',
  //         location: '',
  //         collaboration: '',
  //         shopId: shopId || 0,
  //         imageIds: [],
  //         regionName: '', // Add regionName default value
  //       },
  // });
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    // defaultValues:{
    //   ...initialValues,
    //   shopId: shopId
    // },
    // defaultValues: initialValues ?? { ...defaultValues, shopId },
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      regions: initialValues?.regions || [],
    },
  });
  const { mutate: createEvent, isLoading: creating } = useCreateEventMutation();
  const { mutate: updateEvent, isLoading: updating } = useUpdateeventMutation();

  // const onSubmit = (values: FormValues) => {
  //   // if (!shopId) {
  //   //   setErrorMessage('Shop ID is required');
  //   //   return;
  //   // }
  //   // const transformedRegions = values.region?.name ? [values.region.name] : [];
  //   const transformedRegions = values.region?.name || ''; 
  //   if (!initialValues) {
  //     createEvent(
  //       {
          // title: values.title,
          // eventName: values.eventName,
          // description: values.description,
          // date: values.date,
          // time: values.time,
          // location: values.location,
          // collaboration: values.collaboration,
          // shopId,
          // imageIds: values.imageIds,
          // regionName: transformedRegions,
  //       },
  //       {
  //         onError: (error: any) => {
  //           setErrorMessage(error?.response?.data?.message);
  //           animateScroll.scrollToTop();
  //         },
  //       }
  //     );
  //   } else {
  //     updateEvent({
  //       id: initialValues.id!,
  //       title: values.title,
  //       eventName: values.eventName,
  //       description: values.description,
  //       date: values.date,
  //       time: values.time,
  //       location: values.location,
  //       collaboration: values.collaboration,
  //       shopId: Number(initialValues.shopId),
  //       imageIds: values.imageIds,
  //       regionName:transformedRegions,
  //     });
  //   }
  // };
  const onSubmit = (values: FormValues) => {
    // const transformedRegions = values.regions?.name ? [values.regions.name] : [];
    const transformedRegions = values.regions?.name || ''; 
    const input = {
      language:router.locale, 
      ...values,
      regionName: transformedRegions,
      shopId,
    };

    if (  !initialValues )  {
      createEvent({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
        shop_id: meData?.managed_shop?.id || initialValues?.shop_id,
      });
    } else {
      updateEvent(
        { ...input ,id: initialValues.id!, },
        {
          onSuccess:() => router.push('/events'),
          onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message);
            animateScroll.scrollToTop();
          },
        }
      );
    }
  };
  return (
    <>
      {errorMessage && (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-image')}
            details={`${initialValues ? t('form:item-description-update') : t('form:item-description-add')} ${t('form:form-description-event-name')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="image" control={control} multiple={true} />
          </Card>
        </div>

        {/* Title */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-title')}
            // details={t('form:title-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-title')}
              {...register('title', { required: 'Title is required' })}
              {...register }
              error={t(errors.title?.message!)}
              defaultValue={initialValues?.title}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Event Name */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-event-name')}
            // details={t('form:event-name-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-event-name')}
              {...register('eventName', { required: 'Event name is required' })}
              {...register }
              error={t(errors.eventName?.message!)}
              defaultValue={initialValues?.eventName || ''}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Description */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-description')}
            // details={t('form:description-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <TextArea
              label={t('form:input-label-description')}
              {...register('description', { required: 'Description is required' })}
              {...register }
              error={t(errors.description?.message!)}
              defaultValue={initialValues?.description || ''}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Date */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-date')}
            // details={t('form:date-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              type="date"
              label={t('form:input-label-date')}
              {...register('date', { required: 'Date is required' })}
              {...register }
              error={t(errors.date?.message!)}
              defaultValue={initialValues?.date || ''}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Time */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-time')}
            details={t('form:time-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              type="time"
              label={t('form:input-label-time')}
              {...register('time', { required: 'Time is required' })}
              {...register }
              error={t(errors.time?.message!)}
              defaultValue={initialValues?.time || ''}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Location */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-location')}
            // details={t('form:location-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-location')}
              {...register('location', { required: 'Location is required' })}
              {...register }
              error={t(errors.location?.message!)}
              defaultValue={initialValues?.location || ''}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Collaboration */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-collaboration')}
            // details={t('form:collaboration-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-collaboration')}
              {...register('collaboration', { required: 'Collaboration is required' })}
              {...register }
              error={t(errors.collaboration?.message!)}
              defaultValue={initialValues?.collaboration || ''}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        {/* Region Name */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-region')}
            details={t('form:region-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            {/* <Input
              label={t('form:input-label-region')}
              {...register('regionName', { required: 'Region name is required' })}
              error={t(errors.regionName?.message!)}
              variant="outline"
              className="mb-5"
            /> */}
            <SelectRegion control={control} errors={errors} />
          </Card>
        </div>

        {/* Image IDs */}
        {/* <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-images')}
            // details={t('form:image-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="imageIds" control={control} multiple={true} />
          </Card>
        </div> */}

        {/* Submit button */}
        <div className="text-end mb-5">
          <Button type='submit' loading={creating || updating} disabled={creating || updating}>
            {initialValues ? t('form:button-update') : t('form:button-create')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EventCreateOrUpdate;
