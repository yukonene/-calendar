import {
  PostGenerateSignedUrlsRequestBody,
  PostGenerateSignedUrlsResposeSuccessBody,
} from '@/pages/api/generateSignedUrls';
import axios from 'axios';

export const postGenerateSignedUrls = (
  postData: PostGenerateSignedUrlsRequestBody
) => {
  return axios.post<PostGenerateSignedUrlsResposeSuccessBody>(
    '/api/generateSignedUrls',
    postData
  );
};
