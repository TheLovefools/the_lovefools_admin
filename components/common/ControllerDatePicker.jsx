import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import DatePicker from './DatePicker';

const ControllerDatePicker = ({ name, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          value={field.value}
          defaultDate={field.value}
          isInvalid={!!error}
          placeHolder={'select'}
          errorMessage={error?.message}
          onChange={(date) => {
            if (date) field.onChange(date);
          }}
          onBlur={() => {
            field.onBlur();
          }}
          {...rest}
        />
      )}
    />
  );
};

export default ControllerDatePicker;
