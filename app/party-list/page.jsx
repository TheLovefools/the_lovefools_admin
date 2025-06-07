'use client';
import { useEffect, useRef, useState } from 'react';
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
  addPartyList,
  deletePartyList,
  getPartyList,
  updatePartyList,
} from '../../redux/party-list/partyListSlice.jsx';
import PartyListForm from '../../components/party-list/partyListForm.jsx';
import { formatDate } from '@/utils/formatTime';
import { getUTCMidnightISOString } from '@/utils/utils.jsx';

const PartyBookingList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    partyName: '',
    partyDescription: '',
    partyDate: null,
    partyMobile: '',
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.partyList,
  );

  useEffect(() => {
    dispatch(getPartyList({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getPartyList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getPartyList({}));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      partyName: row.party_Name,
      partyDescription: row.party_Description,
      partyDate: new Date(row.party_Date),
      partyMobile: row.party_Mobile,
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

  const toggleEventListFormModal = () => {
    defaultValues.current = {
      id: null,
      partyName: '',
      partyDescription: '',
      partyDate: null,
      partyMobile: '',
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      dispatch(deletePartyList(id));
      dispatch(getPartyList({ ...listParameters, search: '', page: 1 }));
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  const onSubmit = async (partyBookingData) => {
    const payload = [
      {
        party_Name: partyBookingData.partyName,
        party_Description: partyBookingData.partyDescription,
        party_Date: getUTCMidnightISOString(partyBookingData.partyDate),
        party_Mobile: partyBookingData.partyMobile,
      },
    ];
    try {
      if (!defaultValues.current.id) {
        await dispatch(addPartyList(payload));
        await dispatch(
          getPartyList({ ...listParameters, search: '', page: 1 }),
        );
      } else {
        await dispatch(
          updatePartyList({ id: defaultValues.current, payload: payload }),
        );
        await dispatch(
          getPartyList({ ...listParameters, search: '', page: 1 }),
        );
      }
    } catch (error) {
      console.log(error);
    }
    toggleEventListFormModal();
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Party Bookings </h2>
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
                  toggleEventListFormModal();
                }}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <List
          columns={[
            { id: 'event_Name', label: 'Event Name' },
            { id: 'date', label: 'Event Date' },
            { id: 'Time', label: 'Contact No.' },
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
                <TableCell>{row.party_Name}</TableCell>
                <TableCell>
                  {row.party_Date ? formatDate(row.party_Date) : '-'}
                </TableCell>
                <TableCell>{row.party_Mobile}</TableCell>
                <TableCell>{row.party_Description}</TableCell>
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
            ? 'Update Party Bookings'
            : 'Add Party Bookings'
        }
        onOpenChange={toggleEventListFormModal}>
        <PartyListForm
          handleClose={toggleEventListFormModal}
          handleEventListSubmit={onSubmit}
          defaultValues={defaultValues.current}
          loading={loading}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.PARTY_BOOKING_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default PartyBookingList;
