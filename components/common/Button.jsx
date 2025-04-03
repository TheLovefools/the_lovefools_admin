import React from 'react';
import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';

const Button = ({ children, type = 'button', className = '', ...rest }) => (
  <NextUIButton
    type={type}
    radius='sm'
    className={`${className}`}
    color='primary'
    {...rest}>
    {children}
  </NextUIButton>
);

export default Button;
