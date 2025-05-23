import { TimeInput } from '@nextui-org/react';
import { Time } from '@internationalized/date';

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
  // const timeValue = value?.hour != null
  // ? new Time(value.hour, value.minute, value.second ?? 0)
  // : undefined;
  const timeValue =
    value instanceof Time
      ? value
      : value?.hour != null
        ? new Time(value.hour, value.minute, value.second ?? 0)
        : undefined;
  return (
    <div className='flex w-full flex-row gap-4'>
      <TimeInput
        label={label}
        variant='bordered'
        hideTimeZone
        showMonthAndYearPickers
        // value={value}
        value={timeValue}
        labelPlacement='outside'
        isRequired={isRequired}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        onChange={(time) => {
          if (onChange) {
            if (time) onChange(time);
            console.log('DateTimePicker_', time);
          }
        }}
        {...rest}
      />
    </div>
  );
};

export default DateTimePicker;
