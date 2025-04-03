import * as Yup from 'yup';

export const cmsListSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
});
