'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerTextField from '@/components/common/ControllerTextField';
import Button from '@/components/common/Button';
import FormProvider from '@/components/common/FormProvider';
import { reciptSchema } from '@/schema/receipt/receipt';
import {
  convertTimeObjectToString,
  formatDateForApi,
  generateOptions,
} from '@/utils/utils';
import { menuType, NEXT_PUBLIC_API_URL, subMenuType } from '@/utils/constant';
import { useEffect, useState } from 'react';
import ControllerSelect from '../common/ControllerSelect';
import ControllerDateTimePicker from '../common/ControllerDateTimePicker';
import ControllerDatePicker from '../common/ControllerDatePicker';
import { getMenuList } from '@/redux/menu-list/menuListSlice';
import { useAppDispatch, useAppSelector } from '@/redux/selector';
import axios from 'axios';
import { getTableList } from '@/redux/table-list/tableListSlice';

const ReceiptForm = ({
  handleReceiptSubmit,
  handleClose,
  defaultValues,
  loading,
}) => {
  const methods = useForm({
    resolver: yupResolver(reciptSchema),
    defaultValues,
    mode: 'onBlur',
  });
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.menuList);
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    dispatch(getMenuList({}));
  }, [dispatch]);

  const { handleSubmit, watch } = methods;

  const roomList = useAppSelector((state) => state.roomList);

  const getTables = async () => {
    const Time = convertTimeObjectToString(watch('time'));
    const adjustedDate = new Date(watch('date')).toISOString();
    console.log('API call with:', {
      date: formatDateForApi(watch('date')),
      time: Time,
      roomID: watch('room')?.value,
    });

    if (watch('room')?.value) {
      try {
        // Fetch booking data from the API
        const response = await axios.post(`${NEXT_PUBLIC_API_URL}getBookList`, {
          date: formatDateForApi(watch('date')),
          time: Time,
          roomID: watch('room').value,
        });

        console.log('API Response:', response.data); // Check the API response
        setTableList(response.data.available);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    }
  };

  // Trigger API call when the room is selected
  useEffect(() => {
    console.log('Room selected:', watch('room')); // Log selected room
    if (watch('room')) {
      getTables();
    }
  }, [watch('room')]);

  const onSubmit = async (data) => {
    handleReceiptSubmit(data);
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
              placeholder='Enter email id '
              name='email'
              label='Email'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerTextField
              type='text'
              placeholder='Enter mobile no. '
              name='mobile'
              label='Mobile No.'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerSelect
              options={generateOptions(data, '_id', 'menu_Name')}
              placeholder='Enter receipt name '
              name='receiptName'
              label='Receipt name'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerDatePicker
              placeholder='Enter Date '
              name='date'
              label='Date'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerDateTimePicker
              name='time'
              label='Time'
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
          <div className='grid gap-4'>
            <ControllerSelect
              name='room'
              placeholder='Select room'
              options={generateOptions(roomList.data, '_id', 'room_name')}
              label='Room'
            />
          </div>
          <div className='grid gap-4'>
            <ControllerSelect
              name='table_number'
              placeholder='Select table number'
              options={generateOptions(tableList, '_id', 'table_number')}
              label='Table Number'
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

export default ReceiptForm;
