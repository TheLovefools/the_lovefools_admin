'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import ControllerTextArea from '../common/ControllerTextArea';
import {
  findSingleSelectedValueLabelOption,
  generateOptions,
} from '@/utils/utils';
import {
  enquiryFor,
  eventType,
  statusType,
  subMenuType,
} from '@/utils/constant';
import {
  ArrowUpTrayIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
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

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
    getValues,
  } = methods;

  const onSubmit = async (data) => {
    console.log('enquiry_form_data_', data);
    handleEventListSubmit(data);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}>
      <div className='container mx-auto'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-4'>
            <ControllerDatePicker
              placeholder='Enter Date '
              name='event_date'
              label='Date'
            />
          </div>{' '}
          <div className='grid gap-4'>
            <ControllerDateTimePicker
              name='event_time'
              label='Time'
            />
          </div>
          <div className='col-span-2 grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Enter Event name'
              name='event_name'
              label='Event Name'
            />
          </div>
          <div className='col-span-2 grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Enter Contact Number'
              name='event_mobile'
              label='Mobile'
            />
          </div>
          <div className='col-span-2 grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Enter Email'
              name='event_email'
              label='Email'
            />
          </div>
          <div className='col-span-2 grid gap-4'>
            <ControllerSelect
              options={generateOptions(enquiryFor, 'id', 'type')}
              // options={eventOptions}
              placeholder='Enquiry For'
              name='event_enquiry_option'
              label='Enquiry For'
            />
          </div>
          <div className='col-span-2 grid gap-4'>
            <ControllerTextArea
              type='text'
              placeholder='Enter description '
              name='event_description'
              label='Description'
            />
          </div>
          <div className='col-span-2 grid gap-4'>
            <ControllerSelect
              name='event_type'
              placeholder='Select event type'
              options={generateOptions(eventType, 'id', 'type')}
              label='Event Type'
            />
          </div>
          <div className='justify-space-between col-span-2 my-3 flex space-x-4'>
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
