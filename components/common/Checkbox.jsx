import React from 'react';
import { Checkbox as NextUICheckbox } from '@nextui-org/react';

const Checkbox = ({ children, ...rest }) => {
  return <NextUICheckbox {...rest}>{children}</NextUICheckbox>;
};

export default Checkbox;
