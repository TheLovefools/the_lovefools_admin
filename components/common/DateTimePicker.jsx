import {
  formatTimeObjectTo24HourString,
  parse24HourTimeStringToTimeObject,
} from '@/utils/utils';
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
  const parsedValue = value ? parse24HourTimeStringToTimeObject(value) : null;
  return (
    <div className='flex w-full flex-row gap-4'>
      <TimeInput
        label={label}
        variant='bordered'
        hideTimeZone
        showMonthAndYearPickers
        value={parsedValue}
        labelPlacement='outside'
        isRequired={isRequired}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        onChange={(timeObj) => {
          if (onChange) {
            const formattedTime = formatTimeObjectTo24HourString(timeObj);
            onChange(formattedTime); // Save back 24-hour format
          }
        }}
        {...rest}
      />
    </div>
  );
};

export default DateTimePicker;
