// import { usecreateBlogMutation, useUpdateBlogMutation } from '@/data/blog';
// import { useShopQuery } from '@/data/shop';
// import { useEffect, useState } from 'react';
// import { useFieldArray, useForm } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';
// import Description from '../ui/description';
// import FileInput from '../ui/file-input';
// import Card from '../common/card';
// import Label from '../ui/label';
// import Input from '../ui/input';
// import TextArea from '../ui/text-area';
// import Button from '../ui/button';
// import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
// import AdminLayout from '../layouts/admin';
// import { useRouter } from 'next/router';

// type FormValues = {
//   title?: string | null;
//   content: string;
//   shopId: number;
//   attachementsIds: string[]; // Define it as an array of strings
// };

// const BlogCreateOrUpdateForm = ({ initialValues }: any) => {
//   const router = useRouter();
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const {
//     query: { shop },
//   } = router;
//   const { t } = useTranslation();
//   const { data: shopData } = useShopQuery(
//     {
//       slug: shop as string,
//     },
//     { enabled: !!shop }
//   );
//   const shopId = shopData?.id || initialValues?.shop_id;

//   console.log(
//     'initialValuesdataforBlog-----------------------------------------------------',
//     initialValues
//   );

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: initialValues
//       ? initialValues
//       : { title: '', content: '', shopId: shopId || 0, attachmentIds: [] },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'attachmentIds', // For attachments field array
//   });

//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     shopId: shopId || 0,
//     attachmentIds: [],
//   });

//   useEffect(() => {
//     if (shopId) {
//       setFormData((prevData) => ({
//         ...prevData,
//         shopId,
//       }));
//     }
//   }, [shopId]);

//   const { mutate: createBlog, isLoading: creating } = usecreateBlogMutation();
//   const { mutate: updateBlog, isLoading: updating } = useUpdateBlogMutation();

//   // const onSubmit = () => {
//   //   console.log('Form data:', formData);
//   //   mutate(formData, {
//   //     onSuccess: (data) => {
//   //       console.log('Blog created successfully:', data);
//   //       // Handle success (e.g., show a success message, navigate to another page, etc.)
//   //     },
//   //     onError: (error) => {
//   //       console.error('Error creating blog:', error);
//   //       // Handle error (e.g., show an error message)
//   //     },
//   //   });
//   // };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'shopId' ? parseInt(value, 10) : value,
//     });
//   };

//   const onSubmit = (values: FormValues) => {
//     if (!shopId) {
//       setErrorMessage('Shop ID is required');
//       return;
//     }

//     // Create or update logic based on initial values
//     if (!initialValues) {
//       createBlog(
//         {
//           language: router.locale,
//           title: values.title,
//           content: values.content,
//           shop_id: shopId ? Number(shopId) : Number(initialValues?.shop_id),
//         },
//         {
//           onError: (error: any) => {
//             setErrorMessage(error?.response?.data?.message);
//             animateScroll.scrollToTop();
//           },
//           onSuccess: () => {
//             router.push('/admin/blogs'); // Navigate after success
//           },
//         }
//       );
//     } else {
//       updateBlog({
//         id: initialValues.id!,
//         title: values.title,
//         content: values.content,
//         shop_id: Number(initialValues?.shop_id),
//       });
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
//           <Description
//             title={t('form:input-label-image')}
//             details={t('form:blog-image-helper-text')}
//             className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//           />
//           <Card className="w-full sm:w-8/12 md:w-2/3">
//             <FileInput name="image" control={control} multiple={false} />
//           </Card>
//         </div>
//         <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
//           <Description
//             title={t('form:input-label-blog')}
//             details={t('Create Blog')}
//             className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//           />
//           <Card className="w-full sm:w-8/12 md:w-2/3">
//             <Label>{t('form:input-label-title')}</Label>
//             <Input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               variant="outline"
//               className="mb-5"
//               required
//             />

//             <Label>{t('form:input-label-content')}</Label>
//             <TextArea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               placeholder="Write your content here..."
//               className="mb-5 h-40 w-full rounded-lg border border-gray-300 p-2"
//               required
//             />

//             <Button loading={creating || updating}>
//               {initialValues
//                 ? t('form:item-description-update')
//                 : t('form:item-description-add')}{' '}
//               {t('common:attribute')}
//             </Button>
//           </Card>
//         </div>
//       </form>
//     </>
//   );
// };

// BlogCreateOrUpdateForm.authenticate = {
//   permissions: adminOwnerAndStaffOnly,
// };

// BlogCreateOrUpdateForm.Layout = AdminLayout;

// export const getServerSideProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
//   },
// });

// export default BlogCreateOrUpdateForm;

import { usecreateBlogMutation, useUpdateBlogMutation } from '@/data/blog';
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

  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const { data: shopData } = useShopQuery(
    {
      slug: shop as string,
    },
    { enabled: !!shop }
  );
  const shopId = shopData?.id || initialValues?.shop_id;

  console.log(
    'shopId___________________________________________________',
    shopId
  );

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

  const { mutate: createBlog, isLoading: creating } = usecreateBlogMutation();
  const { mutate: updateBlog, isLoading: updating } = useUpdateBlogMutation();

  const onSubmit = (values: FormValues) => {
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
          attachmentIds: values.attachmentIds,
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
        shop_id: Number(initialValues.shop_id),
        attachmentIds: values.attachmentIds,
      });
    }
  };

  console.log('inityial;Valued-------------------------', initialValues);

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
            details={`${
              initialValues
                ? t('form:item-description-update')
                : t('form:item-description-add')
            } ${t('form:form-description-attribute-name')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="image" control={control} multiple={false} />
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
