'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import ControllerTextArea from '../common/ControllerTextArea';
import { partyListSchema } from '@/schema/party-list/partyList';
import ControllerCalendar from '../common/ControllerCalendar';

const EventListForm = ({
  handleEventListSubmit,
  handleClose,
  defaultValues,
  loading,
}) => {
  const methods = useForm({
    resolver: yupResolver(partyListSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    getValues,
    clearErrors,
  } = methods;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const onSubmit = async (data) => {
    console.log('data', data);
    handleEventListSubmit(data);
  };

  console.log(errors);

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}>
      <div className='party-list-form container mx-auto'>
        <div className='grid gap-4'>
          <div className='grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Event name '
              name='partyName'
              label='Event Name'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerCalendar
              name='partyDate'
              label='Party Booking Date'
              bookedDates={[today]}
              disabledWeekdays={[1]}
              popperClassName='party-list-form'
              minDate={new Date()}
              withPortal={true}
            />
          </div>{' '}
          <div className='grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder="Organizer's Phone No."
              name='partyMobile'
              label='Mobile Number'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerTextArea
              type='text'
              placeholder='Event description '
              name='partyDescription'
              label='Description'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='bordered'
              onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              isLoading={loading}>
              {defaultValues.id ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default EventListForm;
