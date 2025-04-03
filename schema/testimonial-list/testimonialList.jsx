import * as Yup from 'yup';

export const testiMonialListSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  photo: Yup.mixed()
    .nullable()
    .test(
      'fileType',
      'Invalid file type',
      (value) => !value || value instanceof File,
    ),
});
