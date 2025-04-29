'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CONFIRMATION_MESSAGES, enquiryFor, eventType } from '@/utils/constant';
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
  addEventEnquiryList,
  deleteEventEnquiryList,
  getEventEnquiryList,
  updateEventEnquiryList,
} from '../../redux/event-enquiry/eventEnquirySlice';
import EventListForm from '../../components/event-list/eventListForm';
import { formatDate } from '@/utils/formatTime';
import {
  convertToAmPm,
  findSingleSelectedValueLabelOption,
  generateOptions,
} from '@/utils/utils';
import { Time } from '@internationalized/date';
import EventEnquiryForm from '../../components/event-enquiry/EnquiryForm';
import Image from 'next/image';

const EventEnquiryList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    event_name: '',
    event_description: '',
    event_date: null,
    event_time: null,
    event_type: null,
    event_mobile: null,
    event_email: null,
    event_enquiry_option: null,
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.eventEnquiryList,
  );

  useEffect(() => {
    dispatch(getEventEnquiryList({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getEventEnquiryList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getEventEnquiryList({}));
  };

  const handleEditButtonClick = async (row) => {
    const [hr, min] = row.event_Time.split(':');

    defaultValues.current = {
      id: row._id,
      event_name: row.event_Name,
      event_description: row.event_Description,
      event_date: new Date(row.event_Date),
      event_time: new Time(hr, min),
      // event_time: new Time(row.event_Time),
      event_type: findSingleSelectedValueLabelOption(
        generateOptions(eventType, 'id', 'type'),
        row.event_Type,
      ),
      event_mobile: row.event_Mobile,
      event_email: row.event_Email,
      // event_enquiry_option: row.event_Enquiry_Option,
      event_enquiry_option: findSingleSelectedValueLabelOption(
        generateOptions(enquiryFor, 'id', 'type'),
        row.event_Enquiry_Option,
      ),
    };

    setShowModal((prev) => !prev);
  };

  const toggleDeleteModal = (row) => {
    setId(row);
    setDeleteModal((prev) => !prev);
  };

  const handleSearch = (searchQuery) => {
    handleMetaChange({
      ...listParameters,
      search: searchQuery,
      page: 1,
    });
  };

  const toggleUpcomingEventListFormModal = () => {
    defaultValues.current = {
      id: null,
      event_name: '',
      event_description: '',
      event_date: null,
      event_time: null,
      event_type: null,
      event_mobile: null,
      event_email: null,
      event_enquiry_option: null,
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteEventEnquiryList({ id }));
      dispatch(getEventEnquiryList({ ...listParameters, search: '', page: 1 }));
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  useEffect(() => {
    if (!loading) {
      setShowModal(false);
    }
  }, [loading]);

  const onSubmit = async (eventData) => {
    // const payloadDate = formatDate(eventData.event_date);
    const payloadDate = eventData.event_date;
    const payload = {
      event_Name: eventData.event_name,
      event_Description: eventData.event_description,
      event_Date: payloadDate,
      event_Time: eventData.event_time,
      event_Type: eventData.event_type.value,
      event_Mobile: eventData.event_mobile,
      event_Email: eventData.event_email,
      event_Enquiry_Option: eventData.event_enquiry_option.value,
    };

    console.log('enquiry_form_payload_', payload);

    try {
      if (!defaultValues.current.id) {
        const data = await dispatch(addEventEnquiryList(payload));
        if (data) {
          setShowModal(false);
          dispatch(
            getEventEnquiryList({ ...listParameters, search: '', page: 1 }),
          );
        }
      } else {
        const data = await dispatch(
          updateEventEnquiryList({
            id: defaultValues.current.id,
            payload: payload,
          }),
        );
        if (data) {
          setShowModal(false);
          dispatch(
            getEventEnquiryList({ ...listParameters, search: '', page: 1 }),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    toggleUpcomingEventListFormModal();
  };

  const getDataLabel = (options, value) => {
    const getLabel = options && options?.filter((data) => data.id === value);
    console.log('getDataLabel_', getLabel);
    return getLabel[0].type;
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Event Enquiry</h2>
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
                  toggleUpcomingEventListFormModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'event_Name', label: 'Event Name' },
            { id: 'event_Date', label: 'Event Date' },
            { id: 'event_Time', label: 'Event Time' },
            { id: 'event_Mobile', label: 'Contact No.' },
            { id: 'event_Email', label: 'Contact Email.' },
            { id: 'event_Enquiry_Option', label: 'Enquiry For' },
            { id: 'event_Description', label: 'Description' },
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
                <TableCell>{row.event_Name ? row.event_Name : '-'}</TableCell>
                <TableCell>
                  {row.event_Date ? formatDate(row.event_Date) : '-'}
                </TableCell>
                <TableCell>
                  {row.event_Time ? convertToAmPm(row.event_Time) : '-'}
                </TableCell>
                <TableCell>
                  {row.event_Mobile ? row.event_Mobile : '-'}
                </TableCell>
                <TableCell>{row.event_Email ? row.event_Email : '-'}</TableCell>
                <TableCell>
                  {row.event_Enquiry_Option
                    ? getDataLabel(enquiryFor, row.event_Enquiry_Option)
                    : '-'}
                </TableCell>
                <TableCell>{row.event_Description}</TableCell>
                {/* <TableCell>
                  {row.event_type
                    ? getDataLabel(eventType, row.event_type)
                    : '-'}
                </TableCell> */}
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
        header={
          defaultValues.current.id
            ? 'Update Upcoming Event List'
            : 'Add Upcoming Event List'
        }
        onOpenChange={toggleUpcomingEventListFormModal}>
        <EventEnquiryForm
          handleClose={toggleUpcomingEventListFormModal}
          handleEventListSubmit={onSubmit}
          defaultValues={defaultValues.current}
          loading={loading}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.UPCOMING_EVENT_LIST_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default EventEnquiryList;
