import { TimeInput } from '@nextui-org/react';

const DateTimePicker = ({
  isRequired = false,
  isInvalid,
  errorMessage,
  onChange,
  label = '',
  showTimePicker = false,
  value,
  ...rest
}) => {
  return (
    <div className='flex w-full flex-row gap-4'>
      <TimeInput
        label={label}
        variant='bordered'
        hideTimeZone
        showMonthAndYearPickers
        value={value}
        labelPlacement='outside'
        isRequired={isRequired}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        onChange={(time) => {
          if (onChange) {
            if (time) onChange(time);
          }
        }}
        {...rest}
      />
    </div>
  );
};

export default DateTimePicker;
