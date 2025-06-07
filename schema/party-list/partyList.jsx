import * as Yup from 'yup';

export const partyListSchema = Yup.object().shape({
  partyName: Yup.string().required('Event Name is required'),
  partyDate: Yup.date()
    .nullable()
    .required('Date is required')
    .typeError('Invalid date format'),
  partyMobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  partyDescription: Yup.string().required('Description is required'),
});
