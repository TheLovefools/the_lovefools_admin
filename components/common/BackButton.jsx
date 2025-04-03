import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import React, { FC } from 'react';

const BackButton = ({ onClick }) => {
  return (
    <button
      className='mb-3 text-green-800 hover:text-green-800 focus:outline-none'
      onClick={onClick}>
      <ArrowLeftIcon className='h-5 w-5' />
    </button>
  );
};

export default BackButton;
