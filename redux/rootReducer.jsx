import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/auth-slice';
import userInfoReducer from './user-info/user-info-slice';
import ReceiptReducer from '@/redux/receipt/receiptSlice';
import TableListReducer from '@/redux/table-list/tableListSlice';
import ContactFormReducer from '@/redux/contact-form/contactFormSlice';
import UserListReducer from '@/redux/user-list/userListSlice';
import EventListReducer from '@/redux/event-list/eventListSlice';
import GalleryListReducer from '@/redux/gallery-list/galleryListSlice';
import AlaCarteMenuReducer from '@/redux/alacarte-list/alaCarteMenuSlice';
import TestimonialListReducer from '@/redux/testimonial-list/testimonialListSlice';
import CMSListReducer from '@/redux/cms-list/cmsListSlice';
import RoomListReducer from '@/redux/room-list/roomSlice';
import MenuListReducer from '@/redux/menu-list/menuListSlice';
import UpcomingEventListReducer from '@/redux/upcoming-event/upcomingEventSlice';
import EventEnquiryListReducer from '@/redux/event-enquiry/eventEnquirySlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  userInfo: userInfoReducer,
  receipt: ReceiptReducer,
  tableList: TableListReducer,
  contactForm: ContactFormReducer,
  userList: UserListReducer,
  eventList: EventListReducer,
  galleryList: GalleryListReducer,
  alaCarteList: AlaCarteMenuReducer,
  testimonialList: TestimonialListReducer,
  cmsList: CMSListReducer,
  roomList: RoomListReducer,
  menuList: MenuListReducer,
  upcomingEventList: UpcomingEventListReducer,
  eventEnquiryList: EventEnquiryListReducer,
});

export default rootReducer;
