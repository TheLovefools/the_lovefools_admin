import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomDatePicker from './CustomDatePicker';

const ControllerCalendar = ({
  name,
  label,
  placeholder = 'Pick a date',
  minDate,
  maxDate,
  bookedDates = [],
  disabledWeekdays = [],
  popperClassName = '',
  withPortal,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <div className='react-datepicker-wrapper'>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <CustomDatePicker
            // selected={field.value}
            // onChange={field.onChange}
            selected={field.value ? new Date(field.value) : null} // this ensures ISO string becomes a Date
            onChange={(date) => {
              if (date) {
                field.onChange(date.toISOString()); // Pass ISO to RHF
              } else {
                field.onChange(null);
              }
            }}
            dateFormat='MMMM d, yyyy' // Display format like "May 15, 2025"
            minDate={minDate}
            maxDate={maxDate}
            label={label}
            placeholder={placeholder}
            popperClassName={popperClassName}
            disabledDates={bookedDates}
            withPortal={withPortal}
            disabledWeekdays={disabledWeekdays}
            isInvalid={!!error}
            errorMessage={error?.message}
            {...rest}
          />
        )}
      />
    </div>
  );
};

export default ControllerCalendar;
