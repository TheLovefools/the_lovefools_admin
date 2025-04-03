import { useRef, useState } from 'react';
import MainDatePicker from 'tailwind-datepicker-react';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';

const DatePicker = ({
  placeHolder = '',
  defaultDate = null,
  maxDate,
  minDate,
  disabledDates,
  isInvalid,
  errorMessage,
  isDisabled,
  onChange,
  onBlur,
  label = '',
  ...rest
}) => {
  const [show, setShow] = useState(false);

  const menuRef = useRef(null);

  const handleOnBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div
      className={`${isDisabled && 'opacity-disabled'}`}
      onBlur={handleOnBlur}>
      {label && <label className='text-small'>{label}</label>}
      <div
        className={`${label && 'mt-1.5'}`}
        ref={menuRef}>
        <MainDatePicker
          options={{
            autoHide: true,
            todayBtn: false,
            clearBtn: false,
            maxDate,
            minDate,
            theme: {
              background: 'bg-gray-50 rounded-md',
              todayBtn: '',
              clearBtn: '',
              icons: 'bg-transparent',
              text: '',
              disabledText: 'text-gray-300 opacity-40',
              input: `rounded-small bg-transparent border-default-200 border-2 focus:border-default-foreground ${
                isInvalid && 'border-danger'
              }`,
              inputIcon: '',
              selected: 'bg-orange-500',
            },
            icons: {
              prev: () => <ArrowLongLeftIcon className='w-5' />,
              next: () => <ArrowLongRightIcon className='w-5' />,
            },
            datepickerClassNames: 'relative',
            defaultDate,
            language: 'en',
            disabledDates,
            weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            inputPlaceholderProp: placeHolder,
            inputDateFormatProp: {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            },
          }}
          onChange={(date) => {
            onChange(date);
            handleOnBlur();
          }}
          show={show}
          setShow={(show) => {
            if (!isDisabled) setShow(show);
          }}
          {...rest}
        />
        {isInvalid && errorMessage && (
          <div className='p-1 text-tiny text-danger'>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
