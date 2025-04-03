import * as Yup from 'yup';

export const userListSchema = Yup.object().shape({
  mobileNo: Yup.string().required('Mobile no is required'),
  name: Yup.string().required('Name is required'),
  emailId: Yup.string().required('Email is required'),
  description: Yup.string().required('Description is required'),
  photo: Yup.mixed()
    .nullable()
    .test(
      'fileType',
      'Invalid file type',
      (value) => !value || value instanceof File,
    ),
});
