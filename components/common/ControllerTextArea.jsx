import React from 'react';
import { useFormContext, Controller, FieldValues } from 'react-hook-form';
import TextAreaField from './TextAreaField';

const ControllerTextArea = ({ name, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextAreaField
          isInvalid={error ? true : false}
          errorMessage={error?.message}
          {...rest}
          {...field}
        />
      )}
    />
  );
};

export default ControllerTextArea;
