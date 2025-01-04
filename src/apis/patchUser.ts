import {
  PatchUserRequestBody,
  PatchUserResponseSuccessBody,
} from '@/pages/api/user';
import axios from 'axios';

export const patchUser = (patchData: PatchUserRequestBody) => {
  return axios.patch<PatchUserResponseSuccessBody>('/api/user', patchData);
};
