import { GetLoginUserResponseSuccessBody } from '@/pages/api/login';
import axios from 'axios';

export const getLogin = () => {
  return axios.get<GetLoginUserResponseSuccessBody>('/api/login');
};
