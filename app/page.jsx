'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CONFIRMATION_MESSAGES, menuType, subMenuType } from '@/utils/constant';
import { List } from '@/components/common/list/List';
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { TableCell, TableRow, Tooltip } from '@nextui-org/react';
import Button from '@/components/common/Button';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@/redux/selector';
import SearchBar from '@/components/common/SearchBar';
import ReceiptForm from '@/components/receipt/receiptForm';
import PopupModal from '@/components/common/PopupModal';
import {
  addReceipt,
  deleteReceipt,
  getReceiptList,
  updateReceipt,
} from '@/redux/receipt/receiptSlice';
import {
  convertTimeObjectToString,
  convertToAmPm,
  findSingleSelectedValueLabelOption,
  generateOptions,
} from '@/utils/utils';
import { formatDate } from '@/utils/formatTime';
import { getMenuList } from '@/redux/menu-list/menuListSlice';
import { getRoomList } from '@/redux/room-list/roomSlice';
import { getTableList } from '@/redux/table-list/tableListSlice';

const ReceiptList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    email: '',
    receiptName: null,
    room: null,
    table_number: null,
    mobile: '',
    price: '',
    date: null,
    time: null,
    menuType: null,
    subMenuType: null,
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.receipt,
  );

  const roomList = useAppSelector((state) => state.roomList);

  const getAllTables = useAppSelector((state) => state.tableList);

  const menuList = useAppSelector((state) => state.menuList);

  useEffect(() => {
    dispatch(getReceiptList({}));
    dispatch(getMenuList({}));
    dispatch(getRoomList({}));
    dispatch(getTableList({ fetchAll: true, search: 'All' }));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getReceiptList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getReceiptList({}));
    dispatch(getMenuList({}));
    dispatch(getRoomList({}));
    dispatch(getTableList({ fetchAll: true, search: 'All' }));
  };

  const handleEditButtonClick = async (row) => {
    const [hr, min] = row.time.split(':');
    const date = new Date(row.date); // Use the provided date
    date.setHours(hr, min, 0, 0); // Set the time based on the time string

    defaultValues.current = {
      id: row._id,
      email: row.emailId,
      receiptName: findSingleSelectedValueLabelOption(
        generateOptions(menuList.data, '_id', 'menu_Name'),
        row.receiptName,
      ),
      mobile: row.mobileNo,
      date: date, // Combined date and time
      time: { hour: parseInt(hr, 10), minute: parseInt(min, 10) }, // Create an object for TimeInput
      price: row.price,
      menuType: findSingleSelectedValueLabelOption(
        generateOptions(menuType, 'id', 'type'),
        row.type,
      ),
      subMenuType: findSingleSelectedValueLabelOption(
        generateOptions(subMenuType, 'id', 'type'),
        row.sub_type,
      ),
      room: findSingleSelectedValueLabelOption(
        generateOptions(roomList.data, '_id', 'room_name'),
        row.room,
      ),
      table_number: findSingleSelectedValueLabelOption(
        generateOptions(getAllTables.data, '_id', 'table_number'),
        row.table_number,
      ),
    };

    setShowModal((prev) => !prev);
  };

  const toggleDeleteModal = (id) => {
    setId(id);
    setDeleteModal((prev) => !prev);
  };

  const handleSearch = (searchQuery) => {
    handleMetaChange({
      ...listParameters,
      search: searchQuery,
      page: 1,
    });
  };

  const toggleReciptFormModal = () => {
    defaultValues.current = {
      id: null,
      email: '',
      receiptName: null,
      room: null,
      table_number: null,
      mobile: '',
      date: null,
      time: null,
      price: '',
      menuType: null,
      subMenuType: null,
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteReceipt({ id }));
      dispatch(getReceiptList({ ...listParameters, search: '', page: 1 }));
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  const onSubmit = async (receiptData) => {
    const payload = {
      emailId: receiptData.email,
      mobileNo: receiptData.mobile,
      receiptName: receiptData.receiptName.value,
      price: receiptData.price,
      date: receiptData.date,
      time: convertTimeObjectToString(receiptData.time),
      type: receiptData.menuType.value,
      sub_type: receiptData.subMenuType.value,
      room: receiptData.room.value,
      table_number: receiptData.table_number.value,
    };

    try {
      if (!defaultValues.current.id) {
        const data = await dispatch(addReceipt(payload));
        if (data) {
          dispatch(getReceiptList({ ...listParameters, search: '', page: 1 }));
          dispatch(getTableList({ fetchAll: true, search: 'All' }));
        }
      } else {
        const data = await dispatch(
          updateReceipt({ id: defaultValues.current.id, payload: payload }),
        );
        if (data) {
          dispatch(getReceiptList({ ...listParameters, search: '', page: 1 }));
          dispatch(getTableList({ fetchAll: true, search: 'All' }));
        }
      }
    } catch (error) {
      console.log(error);
    }

    toggleReciptFormModal();
  };

  const filterMenu = (type, list) => {
    const getMenu = findSingleSelectedValueLabelOption(
      generateOptions(list, 'id', 'type'),
      type,
    );
    return getMenu?.label;
  };

  const filterMenuList = (type, list, name) => {
    if (name === 'table_number') {
      console.log('getMenu', type, list, name);
    }
    const getMenu = findSingleSelectedValueLabelOption(
      generateOptions(list, '_id', name),
      type,
    );
    return getMenu?.label;
  };
  // const sortedReceipts = useMemo(() => {
  //   return data.sort(
  //     (a, b) => new Date(b.created_date) - new Date(a.created_date),
  //   );
  // }, []);

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Receipt List </h2>
          <div className='flex flex-wrap'>
            <div className='sm: flex w-full gap-4 sm:flex-col md:w-fit lg:w-3/4'>
              <div className='flex w-full flex-col sm:flex-row md:gap-4'>
                <SearchBar
                  type='text'
                  placeholder='Search'
                  className='my-3 max-w-md md:w-50'
                  value={listParameters.search || ''}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className='my-2 flex w-full justify-end sm:w-1/4'>
              <Button
                isIconOnly
                type='button'
                variant='light'
                color='default'
                onClick={refreshBtn}>
                <Tooltip content='Refresh'>
                  <ArrowPathIcon className='h-5 w-5' />
                </Tooltip>
              </Button>
              <Button
                onClick={() => {
                  toggleReciptFormModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'emailId', label: 'Email' },
            {
              id: 'mobileNo',
              label: 'Mobile',
            },
            {
              id: 'receiptName',
              label: 'Receipt Name',
            },
            {
              id: 'date',
              label: 'Date',
            },
            { id: 'Time', label: 'Time  ' },
            { id: 'price', label: 'Price' },
            { id: 'room', label: 'Room' },
            { id: 'table_number', label: 'Table Number' },
            { id: 'type', label: 'Menu Type' },
            { id: 'sub_type', label: 'Sub Menu Type' },
            { id: 'actions', label: 'Actions', fixed: true },
          ]}
          data={{
            data: data.length > 0 ? data : [],
            pageData: { total: total || 0 },
          }}
          meta={listParameters}
          onMetaChange={handleMetaChange}
          removeWrapper
          isStriped
          hideSearch={true}
          loading={loading}
          renderRow={(row) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.emailId}</TableCell>
                <TableCell>{row.mobileNo}</TableCell>
                <TableCell>
                  {row.receiptName
                    ? filterMenuList(
                        row.receiptName,
                        menuList.data,
                        'menu_Name',
                      )
                    : '-'}
                </TableCell>
                <TableCell>{row.date ? formatDate(row.date) : '-'}</TableCell>
                <TableCell>
                  {row.time ? convertToAmPm(row.time) : '-'}
                </TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>
                  {row.room
                    ? filterMenuList(row.room, roomList.data, 'room_name')
                    : '-'}
                </TableCell>
                <TableCell>
                  {row.table_number
                    ? filterMenuList(
                        row.table_number,
                        getAllTables.data,
                        'table_number',
                      )
                    : '-'}
                </TableCell>
                <TableCell>
                  {row.type ? filterMenu(row.type, menuType) : '-'}
                </TableCell>
                <TableCell>
                  {row.sub_type ? filterMenu(row.sub_type, subMenuType) : '-'}
                </TableCell>

                <TableCell>
                  <div className='flex items-center gap-4'>
                    <Button
                      isIconOnly
                      type='button'
                      size='sm'
                      variant='light'
                      color='default'
                      onClick={() => handleEditButtonClick(row)}>
                      <Tooltip content='Edit'>
                        <PencilSquareIcon className='h-5 w-5' />
                      </Tooltip>
                    </Button>

                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color='danger'
                      aria-label='Delete'
                      onClick={() => {
                        toggleDeleteModal(row._id);
                      }}>
                      <Tooltip content='Delete'>
                        <TrashIcon className='h-4 w-4' />
                      </Tooltip>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        />
      </div>
      <PopupModal
        isOpen={showModal}
        header={defaultValues.current.id ? 'Update Recipt' : 'Add Receipt'}
        onOpenChange={toggleReciptFormModal}>
        <ReceiptForm
          loading={loading}
          handleClose={toggleReciptFormModal}
          handleReceiptSubmit={onSubmit}
          defaultValues={defaultValues.current}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.RECEIPT_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default ReceiptList;
