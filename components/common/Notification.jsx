import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { hideNotification } from '../../redux/notification/notification-slice';
import { useAppDispatch, useAppSelector } from '@/redux/selector';
import { selectNotification } from '@/redux/notification/notification-selector';

const Notification = () => {
  const dispatch = useAppDispatch();
  const { isOpen, message, variant } = useAppSelector(selectNotification);
  const typedVariant = variant;

  const handleClose = () => {
    dispatch(hideNotification());
  };

  const colorVariants = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return '';
    }
  };

  const iconVariants = (variant) => {
    switch (variant) {
      case 'success':
        return <CheckCircleIcon className='h-5 w-5' />;
      case 'error':
        return <ExclamationCircleIcon className='h-5 w-5' />;
      default:
        return <></>;
    }
  };

  const Icon = iconVariants(typedVariant);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch]);

  return (
    <>
      {isOpen && (
        <motion.div
          className={`${colorVariants(
            variant,
          )} top-10 fixed right-5 z-50 flex items-center rounded-md p-4 text-white shadow-lg md:right-20 md:top-20`}
          initial={{ opacity: 0, x: '100%', y: '100%' }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: '100%', y: '100%' }}
          transition={{ duration: 0.2 }}>
          <div className='mr-3 flex items-center space-x-2'>
            <span aria-hidden='true'>{Icon}</span>
            <span className='text-sm'>{message}</span>
          </div>
          <button
            onClick={handleClose}
            className='ml-4 cursor-pointer border-none bg-transparent text-white focus:outline-none'>
            <XMarkIcon className='w-5' />
          </button>
        </motion.div>
      )}
    </>
  );
};

export default Notification;
