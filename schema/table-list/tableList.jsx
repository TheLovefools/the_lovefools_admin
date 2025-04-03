import * as Yup from 'yup';

export const tableListSchema = Yup.object().shape({
  tableNo: Yup.string().required('Table no is required'),
  person: Yup.string().required('Person is required'),
  photo: Yup.mixed().nullable(),
});
