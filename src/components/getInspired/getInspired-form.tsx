import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { GetInspired } from '@/types';
import { useTranslation } from 'next-i18next';
import {
  useCreateGetInspiredMutation,
  useUpdateGetInspiredMutation,
} from '@/data/get-inspired';
import { useMeQuery } from '@/data/user';
import form from '../ui/forms/form';
import { useState } from 'react';

const defaultValues = {
  title: '', // Initialize title
  type: '', // Initialize type
  images: [],
  tagIds: [], // Store the selected tag IDs
};

type IProps = {
  initialValues?: GetInspired | null;
  tags: any[]; // Add tags prop
  isTagsLoading: boolean; // Add loading state prop for tags
};

export default function CreateOrUpdateGetInspiredForm({
  initialValues,
  tags,
  isTagsLoading,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: me } = useMeQuery();
  const shop_id = me?.shop_id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GetInspired>({
    defaultValues: initialValues ?? defaultValues,
  });

  const { mutate: createGetInspired, isLoading: creating } =
    useCreateGetInspiredMutation(shop_id);
  const { mutate: updateGetInspired, isLoading: updating } =
    useUpdateGetInspiredMutation(shop_id);

  const onSubmit = async (values: GetInspired) => {
    console.log('values=', values);
    const payload = {
      title: values.title,
      type: values.type,
      shopId: shop_id,
      imageIds: values.images[0], // Assuming this is already processed to get IDs
      tagIds: values.tagIds.length ? values.tagIds : [],
    };

    if (initialValues) {
      updateGetInspired({
        id: initialValues.id,
        shopId: shop_id,
        ...payload,
      });
    } else {
      createGetInspired({
        shopId: shop_id,
        ...payload,
      });
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialValues?.images?.[0]?.thumbnail || null
  );
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setValue('images', [reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };
  // Watch the selected images
  const images = watch('images');
  const selectedTagIds = watch('tagIds'); // Watch the selected tag IDs

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-get-inspired')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          {/* Title Input */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form:input-label-title')}
            </label>
            <Input
              {...register('title', { required: true })}
              placeholder={t('form:input-placeholder-title')}
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-500">
                {t('form:error-title-required')}
              </p>
            )}
          </div>

          {/* Type Input */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form:input-label-type')}
            </label>
            <Input
              {...register('type', { required: true })}
              placeholder={t('form:input-placeholder-type')}
              className="mt-1"
            />
            {errors.type && (
              <p className="text-sm text-red-500">
                {t('form:error-type-required')}
              </p>
            )}
          </div>

          {/* Image Selector */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form:input-label-image')}
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition duration-300 ease-in-out hover:bg-gray-200">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <span className="text-gray-400">
                    {t('form:input-label-select-image')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isTagsLoading && tags.length > 0 && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('form:input-label-tag')}
              </label>
              <select
                {...register('tag')}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="">{t('form:input-label-select-tag')}</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              {errors.tag && (
                <p className="text-sm text-red-500">{errors.tag.message}</p>
              )}
            </div>
          )}
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
            : t('form:button-label-add')}
        </Button>
      </div>
    </form>
  );
}
