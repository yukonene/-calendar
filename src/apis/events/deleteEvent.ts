import { DeleteEventResponseSuccessBody } from '@/pages/api/events/[id]';
import axios from 'axios';

export const deleteEvent = (eventId: number) => {
  return axios.delete<DeleteEventResponseSuccessBody>(`/api/events/${eventId}`);
};
