import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import {
  useCreateGetInspiredMutation,
  useUpdateGetInspiredMutation,
} from '@/data/get-inspired';
import { useMeQuery } from '@/data/user';
import GetInspiredTagInput from './getInspired-tag-input';
import FileInput from '@/components/ui/file-input';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useEffect, useState } from 'react';

export default function CreateOrUpdateGetInspiredForm({ initialValues }) {
  const { t } = useTranslation();
  const { data: me } = useMeQuery();
  const shop_id = me?.shop_id;

  const [attachmentIds, setAttachmentIds] = useState([]); // State to hold attachment IDs

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
      gallery: [],
      tagIds: [],
    },
  });

  const { mutate: createGetInspired, isLoading: creating } =
    useCreateGetInspiredMutation();
  const { mutate: updateGetInspired, isLoading: updating } =
    useUpdateGetInspiredMutation();

  useEffect(() => {
    if (initialValues?.tagIds) {
      setValue('tagIds', initialValues.tagIds);
    }
    if (initialValues?.gallery) {
      setValue('gallery', initialValues.gallery);
    }
  }, [initialValues, setValue]);

  const onSubmit = async (values) => {
    const imageFiles = values.gallery.map((image) =>
      image.url ? image.url : image // Handle newly uploaded images
    );
    const tagIds = values.tagIds.map((tag) => tag.id); // Send tag IDs in the payload
    console.log("Valuesss",values);
    console.log("Image+++",imageFiles);
    // Include attachment IDs in the payload
    const payload = {
      ...values,
      tagIds,  
      imageIds: imageFiles,  
      // attachmentIds,  
      shopId: shop_id, // Ensure shopId is set correctly
    };
    console.log("payload",payload.images);
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
              defaultValue={initialValues?.gallery}
              onChange={(files) => {
                setValue('gallery', files);
                // Here you would typically upload the files and get the attachment IDs
                // For example, after the upload, you could do:
                // setAttachmentIds(uploadedFiles.map(file => file.id)); // Assuming your upload function returns the IDs
              }}
            />
            {gallery && gallery.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
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
// import { useForm } from 'react-hook-form';
// import { useTranslation } from 'next-i18next';
// import Button from '@/components/ui/button';
// import {
//   useCreateGetInspiredMutation,
//   useUpdateGetInspiredMutation,
// } from '@/data/get-inspired';
// import { useMeQuery } from '@/data/user';
// import GetInspiredTagInput from './getInspired-tag-input';
// import FileInput from '@/components/ui/file-input';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import { useEffect, useState } from 'react';

// export default function CreateOrUpdateGetInspiredForm({ initialValues }) {
//   const { t } = useTranslation();
//   const { data: me } = useMeQuery();
//   const shop_id = me?.shop_id;

//   // State to hold attachment IDs
//   const [attachmentIds, setAttachmentIds] = useState([]);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     control,
//     formState: { errors },
//   } = useForm({
//     defaultValues: initialValues ?? {
//       title: '',
//       type: '',
//       gallery: [],
//       tagIds: [],
//     },
//   });

//   const { mutate: createGetInspired, isLoading: creating } = useCreateGetInspiredMutation();
//   const { mutate: updateGetInspired, isLoading: updating } = useUpdateGetInspiredMutation();

//   useEffect(() => {
//     if (initialValues?.tagIds) {
//       setValue('tagIds', initialValues.tagIds);
//     }
//     if (initialValues?.gallery) {
//       setValue('gallery', initialValues.gallery);
//     }
//   }, [initialValues, setValue]);

//   const onSubmit = async (values) => {
//     const imageFiles = values.gallery.map((image) =>
//       image.url ? image.url : image // Handle newly uploaded images
//     );
//     const tagIds = values.tagIds.map((tag) => tag.id); // Extract tag IDs
// console.log("Valuesss",values);
// console.log("Image+++",imageFiles);

//     const payload = {
//       ...values,
//       tagIds,  
//       images: imageFiles,  
//       attachmentIds,  
//       shopId: shop_id,  
//     };
// console.log("payload",payload.images);
//     if (initialValues) {
//       updateGetInspired({
//         id: initialValues.id,
//         ...payload,
//       });
//     } else {
//       createGetInspired(payload);
//     }
//   };

//   // Handling file uploads and updating attachmentIds state
//   const handleFileUpload = async (files) => {
//     try {
//       // Simulating the file upload process - replace this with actual API call
//       const uploadedFileResponses = await Promise.all(
//         files.map(async (file) => {
//           // Simulate a successful file upload response
//           const response = await fakeFileUploadApi(file);
//           return response.id; // Assuming the response has an `id` field
//         })
//       );
  
//       // Set the attachment IDs after successful file uploads
//       setAttachmentIds(uploadedFileResponses);
//     } catch (error) {
//       console.error('File upload failed:', error);
//     }
//   };
  
//   // Simulating a fake file upload API response for demonstration purposes
//   const fakeFileUploadApi = (file) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ id: Math.floor(Math.random() * 1000) }); // Simulate an ID for the uploaded file
//       }, 1000);
//     });
//   };
  
//   // Watch gallery changes
//   const gallery = watch('gallery');

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Card className="w-full p-5">
//         {/* Title Field */}
//         <div className="my-5 flex flex-wrap sm:my-8">
//           <Description
//             title={t('form:input-label-title')}
//             className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//           />
//           <div className="w-full sm:w-8/12 md:w-2/3">
//             <input
//               {...register('title', { required: 'Title is required' })}
//               className="block w-full rounded-lg border p-2"
//             />
//             {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
//           </div>
//         </div>

//         {/* Type Field */}
//         <div className="my-5 flex flex-wrap sm:my-8">
//           <Description
//             title={t('form:input-label-type')}
//             className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//           />
//           <div className="w-full sm:w-8/12 md:w-2/3">
//             <input
//               {...register('type', { required: 'Type is required' })}
//               className="block w-full rounded-lg border p-2"
//             />
//             {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
//           </div>
//         </div>

//         {/* Gallery Image Upload */}
//         <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
//           <Description
//             title={t('form:gallery-title')}
//             className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//           />
//           <div className="w-full sm:w-8/12 md:w-2/3">
//             <FileInput
//               name="gallery"
//               control={control}
//               defaultValue={initialValues?.gallery}
//               onChange={handleFileUpload} // Handle file upload and update attachmentIds
//             />
//             {gallery && gallery.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {gallery.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img.url}
//                     alt={`image-${index}`}
//                     className="h-24 w-24 rounded"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tags Selection */}
//         <div className="my-5 flex flex-wrap sm:my-8">
//           <Description
//             title={t('form:tags-title')}
//             className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//           />
//           <div className="w-full sm:w-8/12 md:w-2/3">
//             <GetInspiredTagInput control={control} setValue={setValue} />
//           </div>
//         </div>

//         <div className="text-end">
//           <Button loading={creating || updating}>
//             {initialValues ? t('form:button-label-update') : t('form:button-label-add')}
//           </Button>
//         </div>
//       </Card>
//     </form>
//   );
// }
