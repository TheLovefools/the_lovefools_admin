import React from 'react';
import Select from './Select';
import { useFormContext, Controller, FieldValues } from 'react-hook-form';

const ControllerSelect = ({
  name,
  placeholder,
  options,
  multiple = false,
  handleInputChange,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          placeholder={placeholder}
          options={options}
          isMulti={multiple}
          handleInputChange={handleInputChange}
          isInvalid={!!error}
          errorMessage={error?.message}
          {...field}
          {...rest}
        />
      )}
    />
  );
};

export default ControllerSelect;
