import { UploadIcon } from '@/components/icons/upload-icon';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Attachment } from '@/types';
import { CloseIcon } from '@/components/icons/close-icon';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { useUploadMutation } from '@/data/upload';
import Image from 'next/image';
import { zipPlaceholder } from '@/utils/placeholders';
import { ACCEPTED_FILE_TYPES } from '@/utils/constants';

const getPreviewFiles = (value) => {
  let files = [];
  if (value) {
    files = Array.isArray(value) ? value : [{ ...value }];
  }
  return files;
};

export default function Uploader({
  onChange,
  value,
  multiple,
  acceptFile,
  helperText,
  maxSize,
}) {
  const { t } = useTranslation();
  const [files, setFiles] = useState(getPreviewFiles(value));
  const { mutate: upload, isLoading: loading } = useUploadMutation();
  const [error, setError] = useState(null);

  // Updated file types to include images and videos
  const ACCEPTED_FILE_TYPES = {
    'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.glb'],
    'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.ogg', '.3gp'],
  };

  const { getRootProps, getInputProps } = useDropzone({
    ...(acceptFile
      ? { ...ACCEPTED_FILE_TYPES }
      : {
          accept: ACCEPTED_FILE_TYPES,
        }),
    multiple,
    maxSize,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length) {
        upload(acceptedFiles, {
          onSuccess: (data) => {
            data = data.map((file, idx) => {
              const splitArray = file?.original?.split('/');
              const fileSplitName = splitArray?.pop()?.split('.');
              const fileType = fileSplitName?.pop();
              const filename = fileSplitName.join('.');
              data[idx]['file_name'] = `${filename}.${fileType}`;
              return file;
            });

            const updatedFiles = multiple ? files.concat(data) : data;
            setFiles(updatedFiles);
            if (onChange) {
              onChange(updatedFiles);
            }
          },
        });
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        file?.errors.forEach((error) => {
          if (error?.code === 'file-too-large') {
            setError(t('error-file-too-large'));
          } else if (error?.code === 'file-invalid-type') {
            setError(t('error-invalid-file-type'));
          }
        });
      });
    },
  });

  const handleDelete = (thumbnail) => {
    const updatedFiles = files.filter((file) => file.thumbnail !== thumbnail);
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const thumbs = files.map((file, idx) => {
    const imgTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tif', 'tiff', 'glb'];
    const videoTypes = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'ogg', '3gp'];

    const splitArray = file?.file_name ? file.file_name.split('.') : file.thumbnail.split('.');
    const fileType = splitArray.pop();
    const filename = splitArray.join('.');
    const isImage = imgTypes.includes(fileType);
    const isVideo = videoTypes.includes(fileType);

    return (
      <div
        className={`relative mt-2 inline-flex flex-col overflow-hidden rounded me-2 ${
          isImage || isVideo ? 'border border-border-200' : ''
        }`}
        key={idx}
      >
        {isImage ? (
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden">
            <Image
              src={file.thumbnail}
              alt={filename}
              fill
              sizes="(max-width: 768px) 100vw"
              className="object-contain"
            />
          </div>
        ) : isVideo ? (
          <div className="flex flex-col items-center">
            <video className="h-16 w-16" controls>
              <source src={file.thumbnail} type={`video/${fileType}`} />
              Your browser does not support the video tag.
            </video>
            <p className="text-xs text-body mt-1">
              {filename}.{fileType}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
              <Image src={zipPlaceholder} width={56} height={56} alt="upload placeholder" />
            </div>
            <p className="text-xs text-body mt-1">
              {filename}.{fileType}
            </p>
          </div>
        )}
        {multiple && (
          <button
            className="absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-light shadow-xl outline-none end-1"
            onClick={() => handleDelete(file.thumbnail)}
          >
            <CloseIcon width={10} height={10} />
          </button>
        )}
      </div>
    );
  });

  useEffect(() => {
    // Clean up URLs to prevent memory leaks
    return () => {
      setError(null);
      files.forEach((file) => URL.revokeObjectURL(file.thumbnail));
    };
  }, [files]);

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
        })}
      >
        <input {...getInputProps()} />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-center text-sm text-body">
          {helperText ? (
            <span className="font-semibold text-gray-500">{helperText}</span>
          ) : (
            <>
              <span className="font-semibold text-accent">{t('text-upload-highlight')}</span>{' '}
              {t('text-upload-message')} <br />
              <span className="text-xs text-body">{t('text-img-format')}</span>
            </>
          )}
        </p>
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </div>

      {(thumbs.length || loading) && (
        <aside className="mt-2 flex flex-wrap">
          {thumbs}
          {loading && (
            <div className="mt-2 flex h-16 items-center ms-2">
              <Loader simple className="h-6 w-6" />
            </div>
          )}
        </aside>
      )}
    </section>
  );
}