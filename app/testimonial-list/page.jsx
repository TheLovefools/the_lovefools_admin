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
  addTestimonialList,
  deleteTestimonialList,
  getTestimonialList,
  updateTestimonialList,
} from '../../redux/testimonial-list/testimonialListSlice';
import TestimonialListForm from '../../components/testimonial-list/testimoniaListForm';
import statusType from '../../utils/constant';
import Image from 'next/image';

const TestimonialList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    name: '',
    description: '',
    photo: null,
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.testimonialList,
  );

  useEffect(() => {
    dispatch(getTestimonialList({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getTestimonialList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getTestimonialList({}));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      name: row.testimonial_Name,
      description: row.description,
      photo: row.photo,
    };

    setShowModal((prev) => !prev);
  };
  const toggleDeleteModal = (row) => {
    setId(row); // Pass the entire row object
    setDeleteModal((prev) => !prev);
  };
  const handleSearch = (searchQuery) => {
    handleMetaChange({
      ...listParameters,
      search: searchQuery,
      page: 1,
    });
  };

  const toggleTestimonialListFormModal = () => {
    defaultValues.current = {
      id: null,
      name: '',
      description: '',
      photo: null,
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!id || !id._id) {
      console.error('Invalid id for deletion');
      return;
    }

    try {
      await dispatch(deleteTestimonialList(id));
      await dispatch(
        getTestimonialList({ ...listParameters, search: '', page: 1 }),
      );
      toast.success('Testimonial deleted successfully.');
    } catch (error) {
      console.error(error);
    }
    toggleDeleteModal();
  };
  const onSubmit = async (eventData) => {
    const payload = [
      {
        testimonial_Name: eventData.name,
        description: eventData.description,
      },
      {
        photo: eventData.photo,
      },
    ];

    try {
      if (!defaultValues.current.id) {
        const data = await dispatch(addTestimonialList(payload));
        if (data) {
          dispatch(
            getTestimonialList({ ...listParameters, search: '', page: 1 }),
          );
        }
      } else {
        const data = await dispatch(
          updateTestimonialList({
            id: defaultValues.current,
            payload: payload,
          }),
        );
        if (data) {
          dispatch(
            getTestimonialList({ ...listParameters, search: '', page: 1 }),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    toggleTestimonialListFormModal();
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Testimonial List </h2>
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
                  toggleTestimonialListFormModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'testimonial_Name', label: 'Name' },
            { id: 'description', label: 'Description' },
            { id: 'photo', label: 'photo', fixed: true },
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
                <TableCell>{row.testimonial_Name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  {' '}
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
          defaultValues.current.id
            ? 'Update Testimonial List'
            : 'Add Testimonial List'
        }
        onOpenChange={toggleTestimonialListFormModal}>
        <TestimonialListForm
          handleClose={toggleTestimonialListFormModal}
          handleTestimonialListSubmit={onSubmit}
          defaultValues={defaultValues.current}
          loading={loading}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.TESTIMONIAL_LIST_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default TestimonialList;
