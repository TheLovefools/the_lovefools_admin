import Image from 'next/image';
import Button from './Button';
import notFound from '../../public/images/404_not_found.svg';

const NotFound = () => {
  return (
    <div className='my-8 flex w-full flex-col items-center justify-center'>
      <Image
        src={notFound}
        alt='404 Not Found'
        width={400}
        height={300}
      />
      <Button
        className='my-8'
        href='/'>
        Home
      </Button>
    </div>
  );
};

export default NotFound;
