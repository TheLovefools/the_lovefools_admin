'use client';
import { Spacer } from '@nextui-org/react';
import LoginForm from '@/components/auth/LoginForm';
import Card from '@/components/common/Card';
import Image from 'next/image';
import img from '../../../public/images/logo.png';

const Login = () => {
  return (
    <>
      <div className='align-center mt-10 flex flex-col items-center'>
        <Image
          className='cursor-pointer'
          width={200}
          height={200}
          src={img}
          alt='logo'
          onClick={() => {
            window.location.href = 'https://www.lovefools-admin_panel/';
          }}
        />
        {/* <span className=' my-2 text-center text-5xl font-semibold text-green-900'>
          Pentacle ERP{' '}
        </span> */}
      </div>
      <div className=' flex flex-col items-center'>
        <Card className='mt-5 md:w-1/3'>
          <div className='text-center text-2xl font-semibold'>Login</div>
          <Spacer y={6} />
          <LoginForm />
        </Card>
      </div>
    </>
  );
};

export default Login;
