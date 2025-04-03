import { useAppDispatch } from '@/redux/selector';
import { ERROR_MESSAGES } from '@/utils/constant';
import { useEffect } from 'react';

const ErrorHandling = ({ error }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.log(errorMessage);
  }, [dispatch, error]);

  return null;
};

export default ErrorHandling;
