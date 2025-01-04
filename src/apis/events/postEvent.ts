import {
  PostEventRequestBody,
  PostEventResponseSuccessBody,
} from '@/pages/api/events';
import axios from 'axios';

export const postEvent = (postData: PostEventRequestBody) => {
  return axios.post<PostEventResponseSuccessBody>('/api/events', postData);
};
