import Select from '@/components/ui/select/select';
import { Controller } from 'react-hook-form';
import { GetOptionLabel, GetOptionValue } from 'react-select';

interface SelectInputProps {
  control: any;
  name: string;
  options: object[];
  getOptionLabel?: GetOptionLabel<unknown>;
  getOptionValue?: GetOptionValue<unknown>;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  defaultValue?: object[] | object | null;
  defValue?: string;
  onChange?: (selectedOption: any) => void;
  rules?: any;
  [key: string]: unknown;
}

const SelectInput = ({
  control,
  options = [],
  name,
  rules,
  getOptionLabel = (option: any) => (option && option.name ? option.name : 'Unknown'),
  getOptionValue = (option: any) => (option && option.code ? option.code : ''),
  disabled = false,
  isMulti = false,
  isClearable = false,
  isLoading = false,
  placeholder = 'Select...',
  defaultValue = null,
  defValue = '',
  onChange,
  ...rest
}: SelectInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
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
          isDisabled={disabled}
          onChange={(selectedOption) => {
            const value = selectedOption || null;
            field.onChange(value);
            if (onChange) onChange(value);
          }}
        />
      )}
    />
  );
};

export default SelectInput;
