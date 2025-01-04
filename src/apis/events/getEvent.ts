import { GetEventResponseSuccessBody } from '@/pages/api/events/[id]';
import axios from 'axios';

export const getEvent = (eventId: number) => {
  return axios.get<GetEventResponseSuccessBody>(`/api/events/${eventId}`);
};
