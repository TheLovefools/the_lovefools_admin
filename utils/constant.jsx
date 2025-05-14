export const NEXT_PUBLIC_API_URL = 'https://api.thelovefools.in/api/user/';

//export const NEXT_PUBLIC_API_URL =
// 'https://lovefools-backend.vercel.app/api/user/';

// export const NEXT_PUBLIC_API_URL = 'http://localhost:5000/api/user/';

export const API_ENDPOINT = {
  LOGIN: 'login',
  ADD_RECEIPT: 'addReceipt',
  UPDATE_RECEIPT: (id) => `updateReceipt/${id}`,
  DELETE_RECEIPT: (id) => `deleteReceipt/${id}`,
  GET_RECEIPT: 'getReceiptList',
  GET_ALL_RECEIPT: 'getAllReceiptList',
  ADD_TABLE_LIST: 'addTable',
  UPDATE_TABLE_LIST: (id) => `updateTable/${id}`,
  DELETE_TABLE_LIST: (id) => `deleteTable/${id}`,
  GET_TABLE_LIST: 'getTableList',
  DELETE_CONTACT_FORM: (id) => `deleteReceipt/${id}`,
  GET_CONTACT_FORM: 'getContactList',
  ADD_USER_LIST: 'addUserInformation',
  UPDATE_USER_LIST: (id) => `updateUserInformation/${id}`,
  DELETE_USER_LIST: (id) => `deleteUserInformation/${id}`,
  GET_USER_LIST: 'getUserInformationList',
  ADD_EVENT_LIST: 'addEvent',
  UPDATE_EVENT_LIST: (id) => `updateEvent/${id}`,
  DELETE_EVENT_LIST: (id) => `deleteEvent/${id}`,
  GET_EVENT_LIST: 'getEventList',
  ADD_FLOOR_LIST: 'addFloor',
  UPDATE_FLOOR_LIST: (id) => `updateFloor/${id}`,
  DELETE_FLOOR_LIST: (id) => `deleteFloor/${id}`,
  GET_FLOOR_LIST: 'getFloorList',
  ADD_ROOM_LIST: 'addRoom',
  UPDATE_ROOM_LIST: (id) => `updateRoom/${id}`,
  DELETE_ROOM_LIST: (id) => `deleteRoom/${id}`,
  GET_ROOM_LIST: 'getRoomList',
  ADD_MENU_LIST: 'addMenu',
  UPDATE_MENU_LIST: (id) => `updateMenu/${id}`,
  DELETE_MENU_LIST: (id) => `deleteMenu/${id}`,
  GET_MENU_LIST: 'getMenuList',

  ADD_PARTY_LIST: 'addParty',
  UPDATE_PARTY_LIST: (id) => `updateParty/${id}`,
  DELETE_PARTY_LIST: (id) => `deleteParty/${id}`,
  GET_PARTY_LIST: 'getPartyList',

  ADD_GALLERY_LIST: 'addGallery',
  UPDATE_GALLERY_LIST: (id) => `updateGallery/${id}`,
  DELETE_GALLERY_LIST: (id) => `deleteGallery/${id}`,
  GET_GALLERY_LIST: 'getGalleryList',

  ADD_ALA_CARTE_LIST: 'addAlaCarteMenu',
  UPDATE_ALA_CARTE_LIST: (id) => `updateAlaCarteMenu/${id}`,
  DELETE_ALA_CARTE_LIST: (id) => `deleteAlaCarteMenu/${id}`,
  GET_ALA_CARTE_LIST: 'getAlaCarteMenu',

  ADD_TESTIMONIAL_LIST: 'addTestimonial',
  UPDATE_TESTIMONIAL_LIST: (id) => `updateTestimonial/${id}`,
  DELETE_TESTIMONIAL_LIST: (id) => `deleteTestimonial/${id}`,
  GET_TESTIMONIAL_LIST: 'getTestimonialList',
  ADD_CMS_LIST: 'addCMS',
  UPDATE_CMS_LIST: (id) => `updateCMS/${id}`,
  // DELETE_CMS_LIST: (id) => `deleteReceipt/${id}`,
  GET_CMS_LIST: 'getCMSList',
  UPLOAD_PHOTO: (id) => `upload/${id}`,
  DELETE_PHOTO: 'delete-image',
  ADD_UPCOMING_EVENT_LIST: 'addUpComingEvent',
  UPDATE_UPCOMING_EVENT_LIST: (id) => `updateUpComingEvent/${id}`,
  DELETE_UPCOMING_EVENT_LIST: (id) => `deleteUpComingEvent/${id}`,
  GET_UPCOMING_EVENT_LIST: 'getUpComingEventList',
  ADD_ENQUIRY_LIST: 'addEnquiry',
  UPDATE_ENQUIRY_LIST: (id) => `updateEnquiry/${id}`,
  DELETE_ENQUIRY_LIST: (id) => `deleteEnquiry/${id}`,
  GET_ENQUIRY_LIST: 'getEnquiry',
  GET_ORDER_STATUS: 'getOrderStatus',
};

export const SortDirection = {
  ASC: 1,
  DESC: -1,
};

export const RECEIPT = {
  RECEIPT_DELETED: 'Receipt deleted successfully',
  RECEIPT_SUCCESS: 'Receipt created successfully',
  RECEIPT_UPDATE: 'Receipt updated successfully',
};

export const ENQUIRY = {
  ENQUIRY_DELETED: 'Enquiry deleted successfully',
  ENQUIRY_SUCCESS: 'Enquiry created successfully',
  ENQUIRY_UPDATE: 'Enquiry updated successfully',
};

export const TABLE_LIST = {
  TABLE_LIST_DELETED: 'Table list deleted successfully',
  TABLE_LIST_SUCCESS: 'Table list created successfully',
  TABLE_LIST_UPDATE: 'Table list updated successfully',
};

export const CONTACT_FORM = {
  CONTACT_FORM_DELETED: 'Contact form deleted successfully',
  CONTACT_FORM_SUCCESS: 'Contact form created successfully',
  CONTACT_FORM_UPDATE: 'Contact form updated successfully',
};

export const USER_LIST = {
  USER_LIST_DELETED: 'User list deleted successfully',
  USER_LIST_SUCCESS: 'User list created successfully',
  USER_LIST_UPDATE: 'User list updated successfully',
};

export const EVENT_LIST = {
  EVENT_LIST_DELETED: 'Event list deleted successfully',
  EVENT_LIST_SUCCESS: 'Event list created successfully',
  EVENT_LIST_UPDATE: 'Event list updated successfully',
};

export const PARTY_LIST = {
  PARTY_LIST_DELETED: 'Party Booking deleted successfully',
  PARTY_LIST_SUCCESS: 'Party Booking created successfully',
  PARTY_LIST_UPDATE: 'Party Booking updated successfully',
};

export const UPCOMING_EVENT_LIST = {
  UPCOMING_EVENT_LIST_DELETED: 'Upcoming Event list deleted successfully',
  UPCOMING_EVENT_LIST_SUCCESS: 'Upcoming Event list created successfully',
  UPCOMING_EVENT_LIST_UPDATE: 'Upcoming Event list updated successfully',
};

export const FLOOR_LIST = {
  FLOOR_LIST_DELETED: 'Floor list deleted successfully',
  FLOOR_LIST_SUCCESS: 'Floor list created successfully',
  FLOOR_LIST_UPDATE: 'Floor list updated successfully',
};

export const ROOM_LIST = {
  ROOM_LIST_DELETED: 'Room list deleted successfully',
  ROOM_LIST_SUCCESS: 'Room list created successfully',
  ROOM_LIST_UPDATE: 'Room list updated successfully',
};

export const CMS_LIST = {
  CMS_LIST_UPDATE: 'CMS list updated successfully',
};

export const GALLERY_LIST = {
  GALLERY_LIST_DELETED: 'Gallery list deleted successfully',
  GALLERY_LIST_SUCCESS: 'Gallery list created successfully',
  GALLERY_LIST_UPDATE: 'Gallery list updated successfully',
};

export const ALA_CARTE_LIST = {
  ALA_CARTE_LIST_DELETED: 'Gallery list deleted successfully',
  ALA_CARTE_LIST_SUCCESS: 'Gallery list created successfully',
  ALA_CARTE_LIST_UPDATE: 'Gallery list updated successfully',
};

export const TESTIMONIAL_LIST = {
  TESTIMONIAL_LIST_DELETED: 'Testimonial list deleted successfully',
  TESTIMONIAL_LIST_SUCCESS: 'Testimonial list created successfully',
  TESTIMONIAL_LIST_UPDATE: 'Testimonial list updated successfully',
};

export const MENU_LIST = {
  MENU_LIST_DELETED: 'Menu list deleted successfully',
  MENU_LIST_SUCCESS: 'Menu list created successfully',
  MENU_LIST_UPDATE: 'Menu list updated successfully',
};

export const ERROR_MESSAGE = 'Something went wrong';

export const CONFIRMATION_MESSAGES = {
  RECEIPT_DELETE: 'Are you sure want to delete this receipt?',
  TABLE_LIST_DELETE: 'Are you sure want to delete this table list?',
  CONTACT_FORM_DELETE: 'Are you sure want to delete this contact form?',
  USER_LIST_DELETE: 'Are you sure want to delete this user list?',
  EVENT_LIST_DELETE: 'Are you sure want to delete this event list?',
  PARTY_BOOKING_DELETE: 'Are you sure want to delete this booking?',
  GALLERY_LIST_DELETE: 'Are you sure want to delete this gallery list?',
  ALA_CARTE_LIST_DELETE: 'Are you sure want to delete this ala carte menu?',
  TESTIMONIAL_LIST_DELETE: 'Are you sure want to delete this testimonial list?',
  ROOM_LIST_DELETE: 'Are you sure want to delete this room list?',
  MENU_LIST_DELETE: 'Are you sure want to delete this menu?',
  UPCOMING_EVENT_LIST_DELETE:
    'Are you sure want to delete this upcoming event ?',
};

export const formDataApi = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

// export const formDataApi = (files = {}) => {
//   const formData = new FormData();
//   Object.entries(files).forEach(([fieldName, file]) => {
//     if (file) {
//       formData.append(fieldName, file);
//     }
//   });
//   return formData;
// };

// export const formDataApiMultiple = (files) => {
//   console.log('formDataApi_ - Files:', files);
//   const formData = new FormData();
//   if (Array.isArray(files)) {
//     files.forEach((file) => {
//       formData.append('files', file); // <-- use 'files' (plural)
//     });
//   } else if (files) {
//     formData.append('files', files); // <-- for single file
//   }
//   console.log('formDataApi_2', formData);
//   return formData;
// };

export const menuType = [
  {
    id: '1',
    type: 'Ala Carte',
  },
  {
    id: '2',
    type: 'Set Menu',
  },
];

export const subMenuType = [
  {
    id: '1',
    type: 'Veg',
  },
  {
    id: '2',
    type: 'Non-Veg',
  },
  ,
  {
    id: '3',
    type: 'Drink',
  },
];

export const statusType = [
  {
    id: '1',
    type: 'Done',
  },
  {
    id: '2',
    type: 'Upcoming',
  },
];

export const galleryType = [
  {
    id: '1',
    type: 'Photo',
  },
  {
    id: '2',
    type: 'Video',
  },
];

export const eventType = [
  {
    id: '1',
    type: 'New Enquiry',
  },
  {
    id: '2',
    type: 'Upcoming Event',
  },
];

export const enquiryFor = [
  {
    id: '0',
    type: 'Big Event',
  },
  {
    id: '1',
    type: 'Get Together',
  },
  {
    id: '2',
    type: 'Party',
  },
  {
    id: '3',
    type: 'Other',
  },
];

export const bookingSlotOptions = [
  {
    value: '0',
    slot: '11:00 AM - 1:00 PM',
  },
  {
    value: '1',
    slot: '1:30 PM - 3:30 PM',
  },
  {
    value: '2',
    slot: '7:00 PM - 9:00 PM',
  },
  {
    value: '3',
    slot: '9:30 PM - 11:30 PM',
  },
];
