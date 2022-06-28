import axios from 'axios';
import { getApiResponse, getHttpErrorResponse } from '@/api/apiResponse';
import { idleTimer } from '@/utils/inactivity';
import { GlobalConfig } from '../config';

// ----------------------------------
//  一般CRUD用的API叫用
// ----------------------------------
const client = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: process.env.VUE_APP_APIPATH_AUTH,
  timeout: process.env.TIMEOUT_MILLISECOND,
  responseType: 'json',
  responseEncoding: 'utf8'
});

client.interceptors.request.use(
  config => {
    config.headers['x-csrf-token'] = localStorage.getItem('x-csrf-token');
    config.headers['x-display-language'] =
      localStorage.getItem('lang') || GlobalConfig.DEFAULT_LANG;
    return config;
  },
  error => Promise.reject(error)
);

client.interceptors.response.use(
  // http狀態碼回傳2XX，由API回傳的狀態
  response => {
    // reset timer
    idleTimer();

    let error = getApiResponse(response.data);
    if (error.message) {
      throw error;
    }
    // TODO: error200 合併成功之後來改吧～
    return Promise.resolve(response); //(response.data);
  },

  // http回傳非2XX的狀態碼
  err => {
    throw getHttpErrorResponse(err);
  }
);

export { client };
