import * as Yup from 'yup';

export const roomListSchema = Yup.object().shape({
  roomName: Yup.string().required('Room Name is required'),
});
