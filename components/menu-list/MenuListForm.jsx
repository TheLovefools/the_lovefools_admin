'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import { reciptSchema } from '@/schema/receipt/receipt';
import ControllerTextArea from '../common/ControllerTextArea';
import { generateOptions } from '@/utils/utils';
import { menuType, subMenuType } from '@/utils/constant';
import {
  ArrowUpTrayIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ControllerSelect from '../common/ControllerSelect';
import { menuSchema } from '@/schema/menu-list/menuList';

const MenuListForm = ({
  handleMenuSubmit,
  handleClose,
  defaultValues,
  loading,
}) => {
  const methods = useForm({
    resolver: yupResolver(menuSchema),
    defaultValues,
    mode: 'onBlur',
  });
  const image_name = defaultValues?.photo?.split('uploads/');
  const [fileName, setfileName] = useState(null);
  const updateFileName = (name) => {
    setfileName(name);
  };

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    getValues,
    watch,
  } = methods;

  const onSubmit = async (data) => {
    handleMenuSubmit(data);
  };

  const handleImageUpload = async (name, event) => {
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
        console.log(error);
      }
    }
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
              placeholder='Enter menu name '
              name='menuName'
              label='Menu Name'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerTextArea
              type='text'
              placeholder='Enter Description '
              name='description'
              label='description'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Enter Price '
              name='price'
              label='Price'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerSelect
              name='menuType'
              placeholder='Select menu type'
              options={generateOptions(menuType, 'id', 'type')}
              label='Type'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerSelect
              name='subMenuType'
              placeholder='Select sub menu type'
              options={generateOptions(subMenuType, 'id', 'type')}
              label='Sub Type'
            />
          </div>
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
                      {fileName ? fileName : defaultValues?.photo}
                    </span>
                    <span className='w-1/6'>
                      <Button
                        onClick={() => {
                          setfileName('');
                          setValue('photo', '');
                        }}
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

export default MenuListForm;
