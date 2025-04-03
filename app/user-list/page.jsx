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
  addUserList,
  deleteUserList,
  getUserList,
  updateUserList,
} from '../../redux/user-list/userListSlice';
import UserListForm from '../../components/user-list/userListForm';

const UserList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    mobileNo: '',
    name: '',
    emailId: '',
    description: '',
    photo: '',
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.userList,
  );

  useEffect(() => {
    dispatch(getUserList({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getUserList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getUserList({}));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      mobileNo: row.mobileNumber,
      name: row.name,
      emailId: row.emailId,
      description: row.Address,
      photo: '',
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

  const toggleUserListModal = () => {
    defaultValues.current = {
      id: null,
      mobileNo: '',
      name: '',
      emailId: '',
      description: '',
      photo: '',
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserList({ id }));
      dispatch(getUserList({ ...listParameters, search: '', page: 1 }));
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  const onSubmit = async (userData) => {
    console.log(userData);

    const payload = {
      mobileNumber: userData.mobileNo,
      name: userData.name,
      emailId: userData.emailId,
      Address: userData.description,
      photo: '',
    };

    try {
      if (!defaultValues.current.id) {
        dispatch(addUserList(payload));
        dispatch(getUserList({ ...listParameters, search: '', page: 1 }));
      } else {
        dispatch(
          updateUserList({ id: defaultValues.current.id, payload: payload }),
        );
        dispatch(getUserList({ ...listParameters, search: '', page: 1 }));
      }
    } catch (error) {
      console.log(error);
    }

    toggleUserListModal();
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>User List </h2>
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
                  toggleUserListModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'mobileNumber', label: 'Mobile No.' },
            { id: 'name', label: 'Name' },
            { id: 'emailId', label: 'Email Id.' },

            {
              id: 'Address',
              label: 'Description',
            },
            // { id: 'photo', label: 'Photo' },
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
                <TableCell>{row.mobileNumber}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.emailId}</TableCell>
                <TableCell>{row.Address}</TableCell>
                {/* <TableCell>{row.photo ? row.photo : '-'}</TableCell> */}
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
        header={defaultValues.current.id ? 'Update User List' : 'Add User List'}
        onOpenChange={toggleUserListModal}>
        <UserListForm
          handleClose={toggleUserListModal}
          handleUserListSubmit={onSubmit}
          defaultValues={defaultValues.current}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.USER_LIST_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default UserList;
