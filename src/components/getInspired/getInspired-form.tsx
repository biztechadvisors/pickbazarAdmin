import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import {
  useCreateGetInspiredMutation,
  useUpdateGetInspiredMutation,
} from '@/data/get-inspired';
import { useMeQuery } from '@/data/user';
import GetInspiredTagInput from './getInspired-tag-input'; // Import tag input component
import FileInput from '@/components/ui/file-input'; // Import FileInput for images
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useEffect } from 'react';

export default function CreateOrUpdateGetInspiredForm({ initialValues }) {
  console.log('initialValues', initialValues);
  const { t } = useTranslation();
  const { data: me } = useMeQuery();
  const shop_id = me?.shop_id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues ?? {
      title: '',
      type: '',
      gallery: [], // For images
      tagIds: [], // For tag IDs
    },
  });

  const { mutate: createGetInspired, isLoading: creating } =
    useCreateGetInspiredMutation();
  const { mutate: updateGetInspired, isLoading: updating } =
    useUpdateGetInspiredMutation();

  // Set tag IDs if initial values are provided
  useEffect(() => {
    if (initialValues?.tagIds) {
      setValue('tagIds', initialValues.tagIds);
    }
  }, [initialValues, setValue]);

  const onSubmit = async (values) => {
    // Process the tags to only include their IDs
    const tagIds = values.tagIds.map((tag) => tag.id); // Only send the tag IDs
    const images = values.gallery.map((image) => image.url); // Get URLs from the gallery image objects

    const payload = {
      ...values,
      tagIds, // Send tag IDs in the payload
      images, // Send image URLs in the payload
      shopId: shop_id, // Ensure shopId is set correctly
    };

    if (initialValues) {
      updateGetInspired({
        id: initialValues.id,
        ...payload,
      });
    } else {
      createGetInspired(payload);
    }
  };

  // Watching for gallery updates
  const gallery = watch('gallery');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full p-5">
        {/* Title Field */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-title')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <div className="w-full sm:w-8/12 md:w-2/3">
            <input
              {...register('title', { required: 'Title is required' })}
              className="block w-full rounded-lg border p-2"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Type Field */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-type')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <div className="w-full sm:w-8/12 md:w-2/3">
            <input
              {...register('type', { required: 'Type is required' })}
              className="block w-full rounded-lg border p-2"
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
        </div>

        {/* Gallery Image Upload */}
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:gallery-title')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <div className="w-full sm:w-8/12 md:w-2/3">
            <FileInput
              name="gallery"
              control={control}
              defaultValue={initialValues?.gallery} // Pass initial gallery values
              onChange={(files) => setValue('gallery', files)} // Set gallery files
            />
            {/* Show selected images */}
            {gallery && gallery.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img.url} // Accessing image URL
                    alt={`image-${index}`}
                    className="h-24 w-24 rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags Selection */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:tags-title')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <div className="w-full sm:w-8/12 md:w-2/3">
            <GetInspiredTagInput control={control} setValue={setValue} />
          </div>
        </div>

        <div className="text-end">
          <Button loading={creating || updating}>
            {initialValues
              ? t('form:button-label-update')
              : t('form:button-label-add')}
          </Button>
        </div>
      </Card>
    </form>
  );
}
