import React, { forwardRef } from 'react';
import { Input } from '@nextui-org/react';
import { formatInput } from '@/utils/utils';

const TextField = (
  {
    name,
    required = false,
    variantType = 'text',
    radius = 'sm',
    labelPlacement = 'outside',
    variant = 'bordered',
    className = '',
    errorMessage,
    isInvalid,
    onChange,
    type,
    value,
    ...rest
  },
  ref,
) => {
  const handleChange = (e) => {
    if (onChange) {
      if (variantType == 'amount') {
        const result = formatInput(e.target.value);
        onChange(result);
      } else {
        onChange(e.target.value);
      }
    }
  };

  return (
    <Input
      ref={ref}
      radius={radius}
      labelPlacement={labelPlacement}
      variant={variant}
      className={`rounded-md bg-white ${className}`}
      isRequired={required}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      onChange={handleChange}
      type={type}
      value={value}
      name={name}
      {...rest}
    />
  );
};

export default forwardRef(TextField);
