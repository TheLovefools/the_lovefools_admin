import * as Yup from 'yup';

export const reciptSchema = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  mobile: Yup.string().required('Mobile No. is required'),
  receiptName: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Receipt menu is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.object().required('Time is required'),
  price: Yup.string().required('Price is required'),
  menuType: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Menu type is required'),
  subMenuType: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Sub menu type is required'),
  room: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Room is required'),
  table_number: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Table Number is required'),
});
