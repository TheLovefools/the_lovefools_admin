import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spacer } from '@nextui-org/react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '@/components/common/FormProvider';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/redux/selector';
import { handleLogin } from '@/redux/auth/auth-slice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { moveToNextPage } from '@/utils/Deeplink';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character',
      ),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (credentials) => {
    try {
      const data = await dispatch(handleLogin(credentials, router));
      if (!data.error) {
        moveToNextPage(router);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <ControllerTextField
          name='username'
          placeholder='Enter your username'
          type='text'
        />
        <Spacer y={4} />

        <label>Password</label>
        <ControllerTextField
          name='password'
          placeholder='Enter your password'
          type={isVisible ? 'text' : 'password'}
          endContent={
            isVisible ? (
              <EyeIcon
                className='w-5 cursor-pointer'
                onClick={toggleVisibility}
              />
            ) : (
              <EyeSlashIcon
                className='w-5 cursor-pointer'
                onClick={toggleVisibility}
              />
            )
          }
        />

        <div className='my-2 text-sm text-blue-600 hover:underline'>
          {/* <Link href={'/forgot-password'}>Forgot Password?</Link> */}
        </div>

        <Spacer y={3} />

        <Button
          type='submit'
          className='w-full'
          isLoading={isSubmitting}>
          Login
        </Button>
      </FormProvider>
    </>
  );
};

export default LoginForm;
