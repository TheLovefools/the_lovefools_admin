// components/CustomDatePicker.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';

const CustomDatePicker = ({
  selected,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  disabledWeekdays,
  dateFormat,
  label,
  errorMessage,
  isInvalid,
  popperClassName,
  withPortal = false,
  placeholder = 'Select a date',
  ...rest
}) => {
  const disabledDatesFiltered = (disabledDates || [])
    .filter((dateStr) => !!dateStr && !isNaN(new Date(dateStr).getTime()))
    .map((dateStr) => new Date(dateStr));

  // Disable specific weekdays
  const filterDate = (date) => {
    const day = date.getDay();
    return !disabledWeekdays.includes(day); // Disable if day is in disabledWeekdays
  };

  return (
    <div className='relative w-full'>
      {label && (
        <label
          className={`text-small ${isInvalid && errorMessage ? 'text-danger' : ''}`}>
          {label}
        </label>
      )}

      <div className={`${label && 'relative mt-1.5'}`}>
        <DatePicker
          selected={selected}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={dateFormat}
          excludeDates={disabledDatesFiltered}
          filterDate={filterDate} // <- Apply the filter
          popperClassName={popperClassName}
          withPortal={withPortal}
          placeholderText={placeholder || 'Select date'}
          className={`calendar-main-class ${isInvalid && errorMessage ? 'border-danger' : ''}`}
          calendarClassName='calendar-outer-class'
          dayClassName={(date) => {
            const baseClass = 'calendar-base-class';
            const todayClass =
              date.toDateString() === new Date().toDateString()
                ? 'calendar-today-class'
                : '';
            const weekendClass =
              date.getDay() === 0 || date.getDay() === 6
                ? 'text-gray-400'
                : 'text-gray-900';
            return `${baseClass} ${todayClass} ${weekendClass}`;
          }}
          renderCustomHeader={({
            monthDate,
            customHeaderCount,
            decreaseMonth,
            increaseMonth,
          }) => (
            <div className='flex items-center justify-between px-2 py-2'>
              <button
                onClick={decreaseMonth}
                className='rounded-md p-1 text-gray-600 hover:text-black'
                type='button'>
                <ArrowLongLeftIcon className='h-4 w-4' />
              </button>
              <span className='text-sm font-medium'>
                {monthDate.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={increaseMonth}
                className='rounded-md p-1 text-gray-600 hover:text-black'
                type='button'>
                <ArrowLongRightIcon className='h-4 w-4' />
              </button>
            </div>
          )}
          {...rest}
        />
        <CalendarDaysIcon className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
      </div>
      {isInvalid && errorMessage && (
        <p className='mt-1 text-tiny text-danger'>{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomDatePicker;
