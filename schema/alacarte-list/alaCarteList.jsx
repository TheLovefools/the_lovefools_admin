import * as Yup from 'yup';

export const alaCarteMenuSchema = Yup.object().shape({
  ala_menu_name: Yup.string().required('Menu name is required'),
  ala_menu_description: Yup.string().required('Menu description is required'),
  photo: Yup.mixed()
    .nullable()
    .test('fileType', 'Invalid file type', (value) => {
      if (!value) return true; // allow empty
      if (typeof value === 'string') return true; // existing URL → valid
      return value instanceof File; // validate only file uploads
    }),
  // photo: Yup.mixed()
  //   .nullable()
  //   .test(
  //     'fileType',
  //     'Invalid file type',
  //     (value) => !value || value instanceof File,
  //   ),
});
