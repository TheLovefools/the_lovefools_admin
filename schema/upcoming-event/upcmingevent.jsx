import * as Yup from 'yup';

export const upcomingListSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),

  description: Yup.string().required('Description is required'),
  photo: Yup.mixed()
    .nullable()
    .test(
      'fileType',
      'Invalid file type',
      (value) => !value || value instanceof File,
    ),
});
