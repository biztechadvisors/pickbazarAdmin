import Uploader from '@/components/common/uploader';
import { Controller } from 'react-hook-form';

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
  acceptFile?: boolean;
  helperText?: string;
  defaultValue?: any;
  maxSize?: number;
}

const FileInput = ({
  control,
  name,
  multiple = true,
  acceptFile = false,
  helperText,
  defaultValue = [],
  maxSize,
}: FileInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { ref, value, onChange, ...rest } }) => (
        <Uploader
          {...rest}
          multiple={multiple}
          acceptFile={acceptFile}
          helperText={helperText}
          maxSize={maxSize}
          value={value}            // Make sure value is being passed to the Uploader
          onChange={(files) => {
            const fileIds = files.map((file: any) => file.id);  // Map files to their IDs
            onChange(fileIds);  // Update attachmentIds with file IDs
          }}
        />
      )}
    />
  );
};

export default FileInput;
