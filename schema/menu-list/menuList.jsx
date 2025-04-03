import * as Yup from 'yup';

export const menuSchema = Yup.object().shape({
  menuName: Yup.string().required('Menu name is required'),
  description: Yup.string().required('description No. is required'),
  price: Yup.string().required('Price is required'),
  menuType: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Menu type is required'),
  subMenuType: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Sub menu type is required'),
  photo: Yup.mixed().nullable().required('Photo is required'),
});
