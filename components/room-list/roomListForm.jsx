'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import { roomListSchema } from '@/schema/room-list/room';

const RoomListForm = ({ handleRoomListSubmit, handleClose, defaultValues }) => {
  const methods = useForm({
    resolver: yupResolver(roomListSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    console.log('data', data);

    handleRoomListSubmit(data);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}>
      <div className='container mx-auto'>
        <div className='grid gap-4'>
          <div className='grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Enter room name '
              name='roomName'
              label='Room Name'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='bordered'
              onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit'>{defaultValues.id ? 'Update' : 'Add'}</Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default RoomListForm;
