import * as Yup from 'yup';

export const galleryListSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  type: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Type is required'),
  youtubeiframe: Yup.string().when('type', {
    is: (type) => type && type.value === '2',
    then: (schema) => schema.required('Youtube iFrame code is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  photo: Yup.mixed()
    .nullable()
    .test(
      'fileType',
      'Invalid file type',
      (value) => !value || value instanceof File,
    ),
  video: Yup.mixed()
    .nullable()
    .test(
      'fileType',
      'Invalid file type',
      (value) => !value || value instanceof File,
    ),
});
