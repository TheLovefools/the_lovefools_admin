'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CONFIRMATION_MESSAGES } from '@/utils/constant';
import { List } from '@/components/common/list/List';
import { ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { TableCell, TableRow, Tooltip } from '@nextui-org/react';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/redux/selector';
import SearchBar from '@/components/common/SearchBar';
import PopupModal from '@/components/common/PopupModal';
import { getCMSList, updateCMSList } from '../../redux/cms-list/cmsListSlice';
import CMSListForm from '../../components/cms-list/cmsListForm';

const CMSList = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    description: '',
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.cmsList,
  );

  useEffect(() => {
    dispatch(getCMSList({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getCMSList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getCMSList({}));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      description: row.description,
    };

    setShowModal((prev) => !prev);
  };

  const handleSearch = (searchQuery) => {
    handleMetaChange({
      ...listParameters,
      search: searchQuery,
      page: 1,
    });
  };

  const toggleCMSListFormModal = () => {
    defaultValues.current = {
      id: null,
      description: '',
    };
    setShowModal((prev) => !prev);
  };

  const onSubmit = async (eventData) => {
    const payload = {
      description: eventData.description,
    };

    try {
      // Wait for the update action to complete
      await dispatch(
        updateCMSList({ id: defaultValues.current.id, payload: payload }),
      ).unwrap(); // Unwrap to handle the promise properly

      // Fetch the updated list
      await dispatch(getCMSList({}));
    } catch (error) {
      console.error('Failed to update CMS list:', error);
    } finally {
      // Close the modal after completing the update
      toggleCMSListFormModal();
    }
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>CMS List </h2>
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
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'section_Name', label: 'Section Name' },
            { id: 'description', label: 'Description' },
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
                <TableCell>{row.section_Name}</TableCell>
                <TableCell>{row.description}</TableCell>
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
          defaultValues.current.id ? 'Update Event List' : 'Add Event List'
        }
        onOpenChange={toggleCMSListFormModal}>
        <CMSListForm
          handleClose={toggleCMSListFormModal}
          handleCMSListSubmit={onSubmit}
          defaultValues={defaultValues.current}
        />
      </PopupModal>
    </>
  );
};

export default CMSList;
