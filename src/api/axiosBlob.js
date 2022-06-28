import axios from 'axios';
import alertUtil from '@/utils/alertUtil.js';
import { getApiResponse, getHttpErrorResponse } from '@/api/apiResponse';
import { idleTimer } from '@/utils/inactivity';
import { GlobalConfig } from '../config';

// ----------------------------------
//  處理下載檔案(Blob格式，csv,img...等)
// ----------------------------------
const clientBlob = axios.create({
  baseURL: process.env.VUE_APP_APIPATH_AUTH,
  responseType: 'blob'
});

clientBlob.interceptors.request.use(
  config => {
    config.headers['x-csrf-token'] = localStorage.getItem('x-csrf-token');
    config.headers['x-display-language'] =
      localStorage.getItem('lang') || GlobalConfig.DEFAULT_LANG;
    return config;
  },
  error => Promise.reject(error)
);

clientBlob.interceptors.response.use(
  // http狀態碼回傳2XX，由API回傳的狀態
  response => {
    // reset timer
    idleTimer();

    // Note: 檔案下載遇到json格式的時候，會是API回傳的錯誤訊息，非正常檔案內容
    if (response.data.type === 'application/json') {
      let reader = new FileReader();
      reader.onload = function() {
        let error = getApiResponse(JSON.parse(reader.result));
        if (error.message) {
          alertUtil.executeFail();
        }
      };
      reader.readAsText(response.data);
    } else {
      // TODO: error200 合併成功之後來改吧～
      return Promise.resolve(response); //(response.data);
    }
  },

  // http回傳非2XX的狀態碼
  err => {
    throw getHttpErrorResponse(err);
  }
);

export { clientBlob };
