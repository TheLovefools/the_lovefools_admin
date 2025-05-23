import * as Yup from 'yup';

export const eventListSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).nullable(),
  // photo: Yup.mixed()
  //   .nullable()
  //   .test(
  //     'fileType',
  //     'Invalid file type',
  //     (value) => !value || value instanceof File,
  //   ),
  photo: Yup.mixed()
    .nullable()
    .test('fileType', 'Invalid file type', (value) => {
      if (!value) return true; // allow empty
      if (typeof value === 'string') return true; // existing URL → valid
      return value instanceof File; // validate only file uploads
    }),
});
