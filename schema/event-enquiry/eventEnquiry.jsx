import * as Yup from 'yup';

export const enquiryListSchema = Yup.object().shape({
  event_name: Yup.string().required('Name is required'),
  event_description: Yup.string().required('Description is required'),
  event_date: Yup.string().required('Date is required'),
  event_time: Yup.string().required('Time is required'),
  event_type: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Event type is required'),
  event_mobile: Yup.string()
    .required('Mobile No. is required')
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  event_email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  event_enquiry_option: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required('Enquiry Option is required'),
});

// event_Name: { type: String},
// event_Description: { type: String, required: true },
// event_Date: { type: Date, required: true }, // Consider changing to Number if appropriate
// event_Time: { type: String, required: true },
// event_Type: { type: String, required: true },
// event_Created_Date: { type: Date, default: Date.now }, // Correct type and set default value
// event_Mobile: {type: String, required: false, match: [/^\d{10}$/, 'Mobile number must be 10 digits']},
// event_Email: {type: String, required: false, match: [/.+\@.+\..+/, 'Please fill a valid email address']},
// event_Enquiry_Option: {type: EnquiryOptionSchema, required: false},

// event_name:
// event_description:
// event_date:
// event_time:
// event_type:
// event_mobile:
// event_email:
// event_enquiry_option:
