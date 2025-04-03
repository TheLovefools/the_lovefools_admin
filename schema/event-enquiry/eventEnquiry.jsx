import * as Yup from 'yup';

export const enquiryListSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),

  description: Yup.string().required('Description is required'),
  event_type: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Event type is required'),
});
