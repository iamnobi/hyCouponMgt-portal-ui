import i18n from '@/plugins/i18n';
import alertUtil from '@/utils/alertUtil.js';

// ----------------------------------
//  axios interceptors api response 共用處理
// ----------------------------------

/**
 *  http狀態碼回傳2XX，由API回傳的狀態處理共用
 *  @param { AxiosResponse.data } data
 */
export let getApiResponse = data => {
  let error = {};
  if (data) {
    let errorMsg = getApiResponseMsg(data);
    if (errorMsg) {
      error.status = data.status;
      error.message = errorMsg;
      error.errorCode = data.message;
    }
  } else {
    error.message = i18n.t('api_response.noResponseData');
  }
  return error;
};

/**
 *  API回傳的狀態碼對應錯息取得
 *  @param { AxiosResponse.data } data
 */
let getApiResponseMsg = data => {
  let errorMsg = null;
  switch (data.status) {
    // Response Success
    case 0:
      break;

    // Response error message
    case 101:
      errorMsg = i18n.t('api_response.dataStatus.101');
      break;
    case 102:
      errorMsg = i18n.t('api_response.dataStatus.102');
      break;
    case 201:
      errorMsg = i18n.t('api_response.dataStatus.201');
      break;
    case 202:
      errorMsg = i18n.t('api_response.dataStatus.202');
      break;
    case 203:
      errorMsg = i18n.t('api_response.dataStatus.203');
      break;
    case 204:
      errorMsg = i18n.t('api_response.dataStatus.204');
      break;
    case 303:
      errorMsg = i18n.t('api_response.dataStatus.303');
      break;
    case 401:
      errorMsg = i18n.t('api_response.dataStatus.401');
      break;
    case 403:
      errorMsg = i18n.t('api_response.dataStatus.403');
      break;
    case 404:
      errorMsg = i18n.t('api_response.dataStatus.404');
      break;
    case 502:
      errorMsg = i18n.t('api_response.dataStatus.502');
      break;
    case 503:
      errorMsg = i18n.t('api_response.dataStatus.503');
      break;
    case 504:
      errorMsg = i18n.t('api_response.dataStatus.504');
      break;
    case 505:
      errorMsg = i18n.t('api_response.dataStatus.505');
      break;
    case 506:
      errorMsg = i18n.t('api_response.dataStatus.506');
      break;
    case 507:
      errorMsg = i18n.t('api_response.dataStatus.507');
      break;
    case 508:
      errorMsg = i18n.t('api_response.dataStatus.508');
      break;
    case 509:
      errorMsg = i18n.t('api_response.dataStatus.509');
      break;
    case 510:
      errorMsg = i18n.t('api_response.dataStatus.510');
      break;
    case 800:
      errorMsg = i18n.t('api_response.dataStatus.800');
      break;
    case 801:
      errorMsg = i18n.t('api_response.dataStatus.801');
      break;
    case 802:
      errorMsg = i18n.t('api_response.dataStatus.802');
      break;
    case 803:
      errorMsg = i18n.t('api_response.dataStatus.803');
      break;
    case 901:
      errorMsg = i18n.t('api_response.dataStatus.901');
      break;
    case 902:
      errorMsg = i18n.t('api_response.dataStatus.902');
      break;
    case 903:
      errorMsg = i18n.t('api_response.dataStatus.903');
      break;
    case 904:
      errorMsg = i18n.t('api_response.dataStatus.904');
      break;
    case 5000:
      errorMsg = i18n.t('api_response.dataStatus.5000');
      break;
    case 5001:
      errorMsg = i18n.t('api_response.dataStatus.5001');
      break;
    case 5002:
      errorMsg = i18n.t('api_response.dataStatus.5002');
      break;
    case 5003:
      errorMsg = i18n.t('api_response.dataStatus.5003');
      break;
    case 5005:
      errorMsg = i18n.t('api_response.dataStatus.5005');
      break;
    case 5101:
      errorMsg = i18n.t('api_response.dataStatus.5101');
      break;
    case 5102:
      errorMsg = i18n.t('api_response.dataStatus.5102');
      break;
    case 5103:
      errorMsg = i18n.t('api_response.dataStatus.5103', {
        pans: data.message.split(':')[1]
      });
      break;
    case 5104:
      errorMsg = i18n.t('api_response.dataStatus.5104', {
        pans: data.message.split(':')[1]
      });
      break;
    case 5105:
      errorMsg = i18n.t('api_response.dataStatus.5105');
      break;
    case 5106:
      errorMsg = i18n.t('api_response.dataStatus.5106');
      break;
    case 5107:
      errorMsg = i18n.t('api_response.dataStatus.5107');
      break;
    case 6000:
      errorMsg = i18n.t('api_response.dataStatus.6000');
      break;
    case 6202:
      errorMsg = i18n.t('api_response.dataStatus.6202');
      break;
    case 6203:
      errorMsg = i18n.t('api_response.dataStatus.6203');
      break;
    case 6204:
      errorMsg = i18n.t('api_response.dataStatus.6204');
      break;
    case 6301:
      errorMsg = i18n.t('api_response.dataStatus.6301');
      break;
    case 6302:
      errorMsg = i18n.t('api_response.dataStatus.6302');
      break;
    case 6400:
      errorMsg = i18n.t('api_response.dataStatus.6400');
      break;
    case 6401:
      errorMsg = i18n.t('api_response.dataStatus.6401');
      break;
    case 6500:
      errorMsg = i18n.t('api_response.dataStatus.6500');
      break;
    case 6501:
      errorMsg = i18n.t('api_response.dataStatus.6501');
      break;
    case 7000:
      errorMsg = i18n.t('api_response.dataStatus.7000');
      break;
    case 8001:
    case 8002:
    case 8003:
    case 8004:
    case 8005:
    case 8006:
    case 8007:
      errorMsg = i18n.t('api_response.dataStatus.800X');
      break;
    case 99999:
      errorMsg = i18n.t('api_response.dataStatus.99999');
      break;
    default:
      errorMsg = data.message;
  }
  return errorMsg;
};

/**
 *  http回傳非2XX的狀態碼，例外處理共用
 *  @param { Object } err
 */
export let getHttpErrorResponse = err => {
  const error = {};
  let errorMsg = null;

  if (err && err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (err.response.status) {
      case 400:
        errorMsg = i18n.t('api_response.httpError.400');
        break;
      case 401:
        errorMsg = i18n.t('api_response.httpError.401');
        alertUtil.loggedOut();
        break;
      case 403:
        errorMsg = i18n.t('api_response.httpError.403');
        alertUtil.noPermission();
        break;
      case 404:
        errorMsg = i18n.t('api_response.httpError.404');
        break;
      case 405:
        errorMsg = i18n.t('api_response.httpError.405');
        break;
      case 500:
        errorMsg = i18n.t('api_response.httpError.500');
        break;
      case 503:
        errorMsg = i18n.t('api_response.httpError.503');
        break;
      case 504:
        errorMsg = i18n.t('api_response.httpError.504');
        break;
      default:
        errorMsg = i18n.t('api_response.httpError.other', {
          status: err.response.status
        });
    }

    if (errorMsg) {
      error.status = err.response.status;
      error.message = errorMsg;
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    error.message = i18n.t('api_response.noResponse');
  } else {
    // Something happened in setting up the request that triggered an Error
    error.message = i18n.t('api_response.requestError');
  }
  return error;
};
