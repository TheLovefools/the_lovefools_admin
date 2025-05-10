import * as Yup from 'yup';

export const reciptDownloadSchema = Yup.object().shape({
  month: Yup.object({
    value: Yup.number().required(),
    label: Yup.string().required(),
  })
    .nullable()
    .required('Month is required'),

  year: Yup.object({
    value: Yup.number().required(),
    label: Yup.string().required(),
  })
    .nullable()
    .required('Year is required'),
});
