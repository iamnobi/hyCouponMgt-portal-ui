import axios from 'axios';
import { getApiResponse, getHttpErrorResponse } from '@/api/apiResponse';
import { GlobalConfig } from '../config';

const client = axios.create({
  baseURL: process.env.VUE_APP_APIPATH,
  timeout: process.env.TIMEOUT_MILLISECOND,
  responseType: 'json'
});

client.interceptors.request.use(
  config => {
    config.headers['x-display-language'] =
      localStorage.getItem('lang') || GlobalConfig.DEFAULT_LANG;
    return config;
  },
  error => Promise.reject(error)
);

client.interceptors.response.use(
  response => {
    let error = getApiResponse(response.data);
    if (error.message) {
      throw error;
    }

    // TODO: error200 合併成功之後來改吧～
    return Promise.resolve(response); //(response.data);
  },
  err => {
    throw getHttpErrorResponse(err);
  }
);

export { client as clientNoAuth };
