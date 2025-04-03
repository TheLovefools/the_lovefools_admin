'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CONFIRMATION_MESSAGES } from '@/utils/constant';
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
import PopupModal from '@/components/common/PopupModal';
import {
  addTableList,
  deleteTableList,
  getTableList,
  updateTableList,
} from '../../../redux/table-list/tableListSlice';
import TableListForm from '@/components/table-list/tableListForm';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const TableList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    room_id: null,
    person: null,
    tableNo: '',
    photo: null,
  });

  const param = useParams();

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.tableList,
  );

  useEffect(() => {
    dispatch(getTableList({ room_id: param.id }));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getTableList({
        ...meta,
        room_id: param.id,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getTableList({ room_id: param.id }));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      room_id: param.id,
      person: row.seatCount,
      tableNo: row.table_number,
      photo: row.photo ? row?.photo : null,
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

  const toggleTableListModal = () => {
    defaultValues.current = {
      id: null,
      room_id: null,
      person: null,
      tableNo: '',
      photo: null,
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      const data = await dispatch(deleteTableList(id));
      if (data) {
        await dispatch(
          getTableList({
            ...listParameters,
            room_id: param.id,
            search: '',
            page: 1,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  const onSubmit = async (tableData) => {
    console.log('tableData', tableData);
    const payload = [
      {
        room_id: param.id,
        table_number: tableData.tableNo,
        seatCount: tableData.person,
      },
      { photo: tableData.photo },
    ];

    try {
      let data;
      if (!defaultValues.current.id) {
        // Await the async action
        data = await dispatch(addTableList(payload)).unwrap();
      } else {
        data = await dispatch(
          updateTableList({ id: defaultValues.current, payload }),
        ).unwrap();
      }

      if (data) {
        // Fetch updated table list
        await dispatch(
          getTableList({
            ...listParameters,
            room_id: param.id,
            search: '',
            page: 1,
          }),
        );
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }

    toggleTableListModal();
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Table List </h2>
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
                  toggleTableListModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'table_number', label: 'Table No.' },
            { id: 'person', label: 'Person' },
            { id: 'photo', label: 'Photo', fixed: true },
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
                <TableCell>{row.table_number}</TableCell>
                <TableCell>{row.seatCount ?? '-'}</TableCell>
                <TableCell>
                  {row.photo ? (
                    <Image
                      height={10}
                      width={70}
                      style={{ maxHeight: '50px' }}
                      src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}${row.photo}`}
                    />
                  ) : (
                    '-'
                  )}
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
                        toggleDeleteModal(row);
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
        header={
          defaultValues.current.id ? 'Update Table List' : 'Add Table List'
        }
        onOpenChange={toggleTableListModal}>
        <TableListForm
          handleClose={toggleTableListModal}
          handleTableListSubmit={onSubmit}
          defaultValues={defaultValues.current}
          loading={loading}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.TABLE_LIST_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default TableList;
