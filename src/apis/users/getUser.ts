import { GetUserResponseSuccessBody } from '@/pages/api/user';
import axios from 'axios';

export const getUser = () => {
  return axios.get<GetUserResponseSuccessBody>('/api/user/');
};
