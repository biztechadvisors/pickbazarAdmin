import Select from '@/components/ui/select/select';
import { selectedOption } from '@/utils/atoms';
import { useAtom } from 'jotai';
import { tree } from 'next/dist/build/templates/app-page';
import { useState } from 'react';
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
  ...rest
}: SelectInputProps) => {
  const [, setSelectedOption] = useAtom(selectedOption);

  const handleChange = (options: any) => {
    setSelectedOption(options);
  };

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
          onChange={handleChange}
        />
      )}
    />
  );
};

export default SelectInput;
