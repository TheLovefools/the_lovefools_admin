import React from 'react';
import RadioGroup from './RadioGroup';
import { useFormContext, Controller, FieldValues } from 'react-hook-form';

const ControllerRadioButton = ({ name, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <RadioGroup
          isInvalid={error ? true : false}
          errorMessage={error?.message}
          {...field}
          {...rest}
        />
      )}
    />
  );
};

export default ControllerRadioButton;
