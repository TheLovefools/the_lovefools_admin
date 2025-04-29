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
  getAlaCarteMenu,
  addAlaCarteMenu,
  updateAlaCarteMenu,
  deleteAlaCarteMenu,
  updateAlaCarteMenuValues,
} from '../../redux/alacarte-list/alaCarteMenuSlice';
import AlaCarteMenutForm from '../../components/alacarte-list/alaCarteMenuForm';
import { galleryType } from '../../utils/constant';
import Image from 'next/image';

const AlaCarteMenuList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    ala_menu_name: '',
    ala_menu_description: null,
    photo: null,
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.alaCarteList,
  );

  useEffect(() => {
    dispatch(getAlaCarteMenu({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getAlaCarteMenu({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getAlaCarteMenu({}));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      ala_menu_name: row.ala_menu_Name,
      ala_menu_description: row.ala_menu_Description,
      photo: row.photo ? row.photo : '',
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

  const toggleAlaCarteMenuFormModal = () => {
    defaultValues.current = {
      id: null,
      ala_menu_name: '',
      ala_menu_description: null,
      photo: null,
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteAlaCarteMenu(id));
      dispatch(getAlaCarteMenu({ ...listParameters, search: '', page: 1 }));
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  const onSubmit = async (alaCarteData) => {
    const payload = [
      {
        ala_menu_Name: alaCarteData.ala_menu_name,
        ala_menu_Description: alaCarteData.ala_menu_description,
      },
      {
        photo: alaCarteData.photo || defaultValues.photo, // Include existing photo if not updated
      },
    ];

    console.log('AlaCarteMenutForm Payload', payload);

    try {
      console.log('Hello from alacarte');
      if (!defaultValues.current.id) {
        const data = await dispatch(addAlaCarteMenu(payload));
        if (data) {
          dispatch(getAlaCarteMenu({ ...listParameters, search: '', page: 1 }));
        }
      } else {
        const data = await dispatch(
          updateAlaCarteMenu({ id: defaultValues.current, payload: payload }),
        );
        if (data) {
          dispatch(getAlaCarteMenu({ ...listParameters, search: '', page: 1 }));
        }
      }
    } catch (error) {
      console.log(error);
    }

    toggleAlaCarteMenuFormModal();
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Ala Cart Menu </h2>
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
                  toggleAlaCarteMenuFormModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'ala_menu_Name', label: 'Menu Name' },
            { id: 'ala_menu_Description', label: 'Menu Description' },
            { id: 'photo', label: 'Menu Thumbnail', fixed: true },
            { id: 'actions', label: 'Actions', fixed: true },
          ]}
          data={{
            data: data.length > 0 ? data : [],
            pageData: { total: total || 0 },
          }}
          // data={{
          //   data: [],
          //   pageData: { total: 0 },
          // }}
          meta={listParameters}
          onMetaChange={handleMetaChange}
          removeWrapper
          isStriped
          hideSearch={true}
          loading={loading}
          renderRow={(row) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.ala_menu_Name}</TableCell>
                <TableCell>{row.ala_menu_Description}</TableCell>
                <TableCell>
                  {row.photo ? (
                    <Image
                      height={10}
                      width={70}
                      style={{ maxHeight: '50px' }}
                      alt='img'
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
          defaultValues.current.id
            ? 'Update Ala Cart Menu'
            : 'Add Ala Cart Menu'
        }
        onOpenChange={toggleAlaCarteMenuFormModal}>
        <AlaCarteMenutForm
          handleClose={toggleAlaCarteMenuFormModal}
          handleAlaCarteMenuSubmit={onSubmit}
          defaultValues={defaultValues.current}
          loading={loading}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.ALA_CARTE_LIST_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default AlaCarteMenuList;
