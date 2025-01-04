import {
  PostUserRequestBody,
  PostUserResponseSuccessBody,
} from '@/pages/api/user';
import axios from 'axios';

export const postUser = (postData: PostUserRequestBody) => {
  return axios.post<PostUserResponseSuccessBody>('/api/user', postData);
};
