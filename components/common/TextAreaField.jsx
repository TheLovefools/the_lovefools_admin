import React, { forwardRef } from 'react';
import { Textarea } from '@nextui-org/react';

const TextAreaField = (
  {
    name,
    placeholder,
    required = false,
    radius = 'sm',
    labelPlacement = 'outside',
    variant = 'bordered',
    className = '',
    errorMessage,
    isInvalid,
    onChange,
    value,
    ...rest
  },
  ref,
) => {
  const handleChange = (e) => {
    // Ensure the event target value is passed correctly
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Textarea
      ref={ref}
      name={name}
      placeholder={placeholder}
      radius={radius}
      labelPlacement={labelPlacement}
      variant={variant}
      className={`rounded-md bg-white ${className}`}
      required={required}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
};

export default forwardRef(TextAreaField);
