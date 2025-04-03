import React, { forwardRef } from 'react';
import TextField from './TextField';
import { useFormContext, Controller } from 'react-hook-form';

const ControllerTextField = ({ name, onChange, variantType, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          variantType={variantType}
          isInvalid={error ? true : false}
          errorMessage={error?.message}
          {...field}
          {...rest}
          onChange={(e) => {
            field.onChange(e);
            if (onChange) {
              onChange(e);
            }
          }}
        />
      )}
    />
  );
};

export default forwardRef(ControllerTextField);
