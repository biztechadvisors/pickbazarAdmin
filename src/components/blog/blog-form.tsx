import { useCreateBlogMutation, useUpdateBlogMutation } from '@/data/blog';
import { useShopQuery } from '@/data/shop';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { init } from 'next/dist/compiled/webpack/webpack';

type FormValues = {
  title: string;
  content: string;
  attachmentIds: string[];
  shopId: number;
};

const BlogCreateOrUpdateForm = ({ initialValues }: any) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shopSlug, setShopSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSlug = localStorage.getItem('shopSlug');
      setShopSlug(storedSlug);
    }
  }, []);
  const { t } = useTranslation();
  const { data: shopData } = useShopQuery(
    {
      slug: shopSlug as string,
    },
    { enabled: !!shopSlug }
  );
  const shopId = shopData?.id || initialValues?.shop?.id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? initialValues
      : { title: '', content: '', shopId: shopId || 0, attachmentIds: [] },
  });

  const { mutate: createBlog, isLoading: creating } = useCreateBlogMutation();
  const { mutate: updateBlog, isLoading: updating } = useUpdateBlogMutation();

  const onSubmit = (values: FormValues) => {
    const attachmentIds = values.attachmentIds
    if (!shopId) {
      setErrorMessage('Shop ID is required');
      return;
    }

    if (!initialValues) {
      createBlog(
        {
          language: router.locale,
          title: values.title,
          content: values.content,
          shopId,
          attachmentIds,
        },
        {
          onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message);
            animateScroll.scrollToTop();
          },
          // onSuccess: () => {
          //   router.push('/admin/blogs');
          // },
        }
      );
    } else {
      updateBlog({
        id: initialValues.id!,
        title: values.title,
        content: values.content,
        shop_id: Number(initialValues?.shop?.id),
        attachmentIds,
        regionName: "IN"
      });
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
            details={`${initialValues
              ? t('form:item-description-update')
              : t('form:item-description-add')
              } ${t('form:form-description-attribute-name')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="attachmentIds" control={control} multiple={false} />
          </Card>
        </div>

        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-title')}
            details={t('form:title-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-title')}
              {...register('title', { required: 'Title is required' })}
              error={t(errors.title?.message!)}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-content')}
            details={t('form:content-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <TextArea
              label={t('form:input-label-content')}
              {...register('content', { required: 'Content is required' })}
              error={t(errors.content?.message!)}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        <div className="text-end">
          <Button variant="outline" onClick={router.back} className="me-4">
            {t('form:button-label-back')}
          </Button>
          <Button loading={creating || updating}>
            {initialValues
              ? t('form:item-description-update')
              : t('form:item-description-add')}{' '}
            {t('common:blog')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default BlogCreateOrUpdateForm;
