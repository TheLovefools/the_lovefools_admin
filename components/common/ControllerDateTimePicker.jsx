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
                if (date) {
                  onChange(date);
                  console.log('ControllerDateTimePicker_', date);
                }
              }}
              // onChange={(date) => {
              //   if (date) {
              //     const hours = String(date.getHours()).padStart(2, '0');
              //     const minutes = String(date.getMinutes()).padStart(2, '0');
              //     const seconds = String(date.getSeconds()).padStart(2, '0');
              //     const formatted = `${hours}:${minutes}:${seconds}`;
              //     onChange(formatted);
              //   }
              // }}
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
