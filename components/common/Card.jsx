import React from 'react';
import { Card as NextUICard, CardProps } from '@nextui-org/react';

const Card = ({ className = '', children, ...rest }) => {
  return (
    <NextUICard
      className={`overflow-visible p-4 ${className}`}
      {...rest}>
      {children}
    </NextUICard>
  );
};

export default Card;
