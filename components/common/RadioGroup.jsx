import React, { forwardRef } from 'react';
import { Radio, RadioGroup as NextUIRadioGroup } from '@nextui-org/react';

const RadioGroup = ({ name, label = null, options, ...rest }, ref) => {
  return (
    <NextUIRadioGroup
      ref={ref}
      id={name}
      name={name}
      label={label ? label : undefined}
      {...rest}>
      {options?.map((option) => (
        <Radio
          key={option.value}
          value={option.value}>
          {option.label}
        </Radio>
      ))}
    </NextUIRadioGroup>
  );
};

export default forwardRef(RadioGroup);
