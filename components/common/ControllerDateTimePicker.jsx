import React from 'react';
import { useFormContext, Controller, FieldValues } from 'react-hook-form';
import { I18nProvider } from '@react-aria/i18n';
import DateTimePicker from './DateTimePicker';

const ControllerDateTimePicker = ({ name, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <I18nProvider locale='en-In-indian'>
          <div className='flex w-full flex-row gap-4'>
            <DateTimePicker
              value={value}
              // className='max-w-md'
              name={name}
              isInvalid={!!error}
              placeHolder={'select'}
              errorMessage={error?.message}
              onChange={(date) => {
                if (date) onChange(date);
              }}
              onBlur={onBlur}
              {...rest}
            />
          </div>
        </I18nProvider>
      )}
    />
  );
};

export default ControllerDateTimePicker;
