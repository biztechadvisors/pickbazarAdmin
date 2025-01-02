import Select from '@/components/ui/select/select';
import { tree } from 'next/dist/build/templates/app-page';
import { Controller } from 'react-hook-form';
import { GetOptionLabel, GetOptionValue } from 'react-select';
import { boolean } from 'yup';

interface SelectInputProps {
  control: any;
  rules?: any;
  name: string;
  options: object[];
  getOptionLabel?: GetOptionLabel<unknown>;
  getOptionValue?: GetOptionLabel<unknown>;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  [key: string]: unknown;
  placeholder?: string;
  defaultValue: object[];
  defValue?: string;
}

const SelectInput = ({
  control,
  options,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  disabled,
  isMulti,
  isClearable,
  isLoading,
  placeholder,
  defaultValue,
  defValue,
  onChange,
  ...rest
}: SelectInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      {...rest}
      render={({ field }) => (
        <Select
          {...field}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          placeholder={placeholder}
          isMulti={isMulti}
          isClearable={isClearable}
          defaultInputValue={defValue}
          isLoading={isLoading}
          hideSelectedOptions={true}
          options={options}
          isDisabled={disabled as boolean}
          onChange={(selectedOption) => {
            field.onChange(selectedOption);
            if (onChange) onChange(selectedOption);
          }}
        />
      )}
    />
  );
};

export default SelectInput;

