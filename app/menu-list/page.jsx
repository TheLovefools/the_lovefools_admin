'use client';
import React, { useEffect, useRef, useState } from 'react';
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
import MenuListForm from '../../components/menu-list/MenuListForm';
import PopupModal from '@/components/common/PopupModal';
import {
  addMenu,
  deleteMenu,
  getMenuList,
  updateMenu,
} from '../../redux/menu-list/menuListSlice';
import {
  findSingleSelectedValueLabelOption,
  generateOptions,
} from '@/utils/utils';
import Image from 'next/image';

const MenuList = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useAppDispatch();
  const defaultValues = useRef({
    id: null,
    menuName: '',
    description: '',
    price: '',
    menuType: null,
    subMenuType: null,
    photo: null,
  });

  const { listParameters, data, total, loading } = useAppSelector(
    (state) => state.menuList,
  );

  useEffect(() => {
    dispatch(getMenuList({}));
  }, []);

  const handleMetaChange = (meta) => {
    dispatch(
      getMenuList({
        ...meta,
        search: meta.search,
      }),
    );
  };

  const refreshBtn = () => {
    dispatch(getMenuList({}));
  };

  const handleEditButtonClick = async (row) => {
    defaultValues.current = {
      id: row._id,
      menuName: row.menu_Name,
      description: row.description,
      price: row.price,
      // menuType: findSingleSelectedValueLabelOption(
      //   generateOptions(menuType, 'id', 'type'),
      //   row.menuType,
      // ),
      menuType: '2',
      subMenuType: findSingleSelectedValueLabelOption(
        generateOptions(subMenuType, 'id', 'type'),
        row.subMenuType,
      ),
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

  const toggleReciptFormModal = () => {
    defaultValues.current = {
      id: null,
      menuName: '',
      description: '',
      price: '',
      menuType: null,
      subMenuType: null,
      photo: null,
    };
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMenu(id));
      await dispatch(getMenuList({ ...listParameters, search: '', page: 1 }));
    } catch (error) {
      console.log(error);
    }
    setId(null);
    toggleDeleteModal();
  };

  const onSubmit = async (menuData) => {
    const payloadOld = [
      {
        menu_Name: menuData.menuName,
        description: menuData.description,
        price: menuData.price,
        // menuType: menuData.menuType.value,
        menuType: '2', // 2 is for setmenu type
        subMenuType: menuData.subMenuType.value,
      },
      {
        photo: menuData.photo,
      },
    ];

    const payload = [
      {
        menu_Name: menuData.menuName,
        description: menuData.description,
        price: menuData.price,
        // menuType: menuData.menuType.value,
        menuType: '2', // 2 is for setmenu type
        subMenuType: menuData.subMenuType.value,
      },
    ];

    // Add photo only if user uploaded a new file
    if (menuData.photo instanceof File) {
      payload.push({ photo: menuData.photo });
    }

    console.log('SetMenutForm Payload', menuData, payload);

    try {
      if (!defaultValues.current.id) {
        console.log('Hello from SetMenu Page');
        const data = await dispatch(addMenu(payload));
        if (data) {
          dispatch(getMenuList({ ...listParameters, search: '', page: 1 }));
        }
      } else {
        console.log('Hello from SetMenu Page 2');
        const data = await dispatch(
          updateMenu({ id: defaultValues.current, payload: payload }),
        );
        if (data) {
          dispatch(getMenuList({ ...listParameters, search: '', page: 1 }));
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
    return getMenu.label;
  };

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col justify-between'>
          <h2 className='text-2xl font-semibold'>Menu List </h2>
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
            { id: 'menu_Name', label: 'Menu Name' },
            {
              id: 'description',
              label: 'Description',
            },
            { id: 'price', label: 'Price' },
            // { id: 'type', label: 'Menu Type' },
            { id: 'sub_type', label: 'Sub Menu Type' },
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
                <TableCell>{row.menu_Name}</TableCell>
                <TableCell>{row.description}</TableCell>

                <TableCell>{row.price}</TableCell>
                {/* <TableCell>
                  {row.menuType ? filterMenu(row.menuType, menuType) : '-'}
                </TableCell> */}
                <TableCell>
                  {row.subMenuType
                    ? filterMenu(row.subMenuType, subMenuType)
                    : '-'}
                </TableCell>
                <TableCell>
                  {row.photo ? (
                    <Image
                      height={10}
                      width={70}
                      style={{ maxHeight: '50px' }}
                      // src={`https://the-lovefools.s3.eu-north-1.amazonaws.com/uploads/${row.photo}`}
                      src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}${row.photo}`}
                      alt='image'
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
        header={defaultValues.current.id ? 'Update Menu' : 'Add Menu'}
        onOpenChange={toggleReciptFormModal}>
        <MenuListForm
          handleClose={toggleReciptFormModal}
          handleMenuSubmit={onSubmit}
          defaultValues={defaultValues.current}
          loading={loading}
        />
      </PopupModal>
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={CONFIRMATION_MESSAGES.MENU_LIST_DELETE}
        onClose={toggleDeleteModal}
        onConfirm={() => {
          handleDelete();
        }}
      />
    </>
  );
};

export default MenuList;
