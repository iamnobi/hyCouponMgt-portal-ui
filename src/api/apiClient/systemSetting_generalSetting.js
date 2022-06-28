import { client } from '../axiosJson';

// ----------------------------------
//  system setting - 一般設定
// ----------------------------------

/**
 * 取得設定值
 *
 * @export
 * @return {*} Generic API response
 */
export function apiGetGeneralSettings() {
  return client.get('/system-setting/general-setting');
}

/**
 * 儲存設定值
 *
 * @export
 * @param {Number} preqResendInterval PReq 重送間隔（分）
 * @param {Number} areqConnectionTimeout AReq Connection Timeout（秒）
 * @param {Number} rreqConnectionTimeout RReq Connection Timeout（秒）
 * @param {Number} areqReadTimeout AReq Read Timeout（秒）
 * @return {*} Generic API response
 */
export function apiSaveGeneralSettings(
  preqResendInterval,
  areqConnectionTimeout,
  rreqConnectionTimeout,
  areqReadTimeout
) {
  return client.post('/system-setting/general-setting', {
    preqResendInterval,
    areqConnectionTimeout,
    rreqConnectionTimeout,
    areqReadTimeout
  });
}
