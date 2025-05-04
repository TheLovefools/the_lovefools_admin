'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import ControllerTextArea from '../common/ControllerTextArea';
import { generateOptions } from '@/utils/utils';
import { statusType, subMenuType } from '@/utils/constant';
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

const EventListForm = ({
  handleEventListSubmit,
  handleClose,
  defaultValues,
  loading,
}) => {
  const methods = useForm({
    resolver: yupResolver(eventListSchema),
    defaultValues,
    mode: 'onBlur',
  });
  const image_name = defaultValues?.photo?.split('uploads/');

  const [fileName, setfileName] = useState('');
  const [photoFileName, setPhotoFileName] = useState(null);

  const updateFileName = (name) => {
    setPhotoFileName(name);
  };

  // useEffect(() => {
  //   setValue('photo', fileName);
  // }, []);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    getValues,
    clearErrors,
  } = methods;

  const onSubmit = async (data) => {
    console.log('data', data);
    handleEventListSubmit(data);
  };

  const handleImageUploadOld = async (name, event) => {
    const { files } = event.target;
    const selectedFile = files && files.length ? files[0] : '';
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        setValue(name, selectedFile);
        clearErrors(name);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleImageUpload = async (name, event) => {
    const { files } = event.target;
    const selectedFile = files && files.length ? files[0] : '';
    if (selectedFile) {
      try {
        setValue(name, selectedFile); // Update the form state with the selected file
        const fileName = selectedFile.name;
        setPhotoFileName(fileName); // Update the photo file name
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleClearFile = (name, setter) => {
    setter(''); // Clear file name state
    setValue(name, ''); // Reset form value for file input
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
          {/* <div className='grid gap-4'>
            <ControllerSelect
              name='status'
              placeholder='Select status'
              options={generateOptions(statusType, 'id', 'type')}
              label='Status'
            />
          </div> */}
          <div className='grid grid-cols-1 gap-4'>
            <div>
              <h6
                className={`mb-2 pt-1 text-small ${
                  errors?.photo?.message ? 'text-red-500' : 'text-black'
                }`}>
                Photo
              </h6>
              <div>
                <input
                  type='file'
                  accept='image/*'
                  name='detailReports'
                  id='file-upload-button-for-photo'
                  className='file-upload-btn mb-2 w-5/6'
                  onChange={(e) => {
                    handleImageUpload('photo', e);
                    updateFileName(
                      e.target.files ? e.target.files[0].name : '',
                    );
                  }}
                />
                <div className='flex'>
                  <div
                    className='mb-4 flex'
                    id='file-upload-label'>
                    <label
                      htmlFor='file-upload-button-for-photo'
                      className='flex-initial cursor-pointer'>
                      <div className='relative h-0 w-5'>
                        <ArrowUpTrayIcon />
                      </div>
                      <p className='relative left-6'>Choose a file</p>
                    </label>
                  </div>
                </div>
                {getValues('photo') && (
                  <>
                    <span className='m-1'>
                      {photoFileName ? photoFileName : defaultValues?.photo}
                    </span>
                    <span className='w-1/6'>
                      <Button
                        onClick={() =>
                          handleClearFile('photo', setPhotoFileName)
                        }
                        className='float-right'
                        isIconOnly
                        type='button'
                        variant='light'
                        color='default'>
                        <XMarkIcon className='h-5 w-5' />
                      </Button>
                    </span>
                  </>
                )}
              </div>
              {errors?.photo?.message &&
                typeof errors.photo.message === 'string' && (
                  <h6 className='p-1 text-xs text-red-500'>
                    {errors.photo.message}
                  </h6>
                )}
            </div>
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
