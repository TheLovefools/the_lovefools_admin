'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import ControllerTextArea from '../common/ControllerTextArea';
import { generateOptions } from '@/utils/utils';
import { eventType, statusType, subMenuType } from '@/utils/constant';
import {
  ArrowUpTrayIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ControllerSelect from '../common/ControllerSelect';
import { Tooltip } from '@nextui-org/react';
import ControllerDatePicker from '../common/ControllerDatePicker';
import ControllerDateTimePicker from '../common/ControllerDateTimePicker';
import { eventListSchema } from '@/schema/event-list/eventList';
import { upcomingListSchema } from '@/schema/upcoming-event/upcmingevent';
import { enquiryListSchema } from '@/schema/event-enquiry/eventEnquiry';

const EventEnquiryForm = ({
  handleEventListSubmit,
  handleClose,
  defaultValues,
  loading,
}) => {
  const methods = useForm({
    resolver: yupResolver(enquiryListSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    handleEventListSubmit(data);
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
              placeholder='Enter name '
              name='name'
              label='Name'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerDatePicker
              placeholder='Enter Date '
              name='date'
              label='Date'
            />
          </div>{' '}
          <div className='grid gap-4'>
            <ControllerDateTimePicker
              name='time'
              label='Time'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerTextArea
              type='text'
              placeholder='Enter description '
              name='description'
              label='Description'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerSelect
              name='event_type'
              placeholder='Select event type'
              options={generateOptions(eventType, 'id', 'type')}
              label='Event Type'
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

export default EventEnquiryForm;
