import { client } from '../axiosJson';

/**
 * 取得 MCC 列表
 *
 * @export
 * @return {*} Generic API response
 */
export function apiGetMccList() {
  return client.get('system-setting/mcc/query');
}

/**
 * 上傳 MCC 列表
 *
 * @export
 * @param {*} file MCC 列表 CSV 檔
 * @return {*} Generic API response
 */
export function apiUploadMccList(file) {
  const formData = new FormData();
  formData.append('mcc_csv', file);
  return client.post('system-setting/mcc/import', formData);
}
