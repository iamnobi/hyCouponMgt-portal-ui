import { client } from '../axiosJson';

// ----------------------------------
//  system setting - CA certificate
// ----------------------------------

/**
 *  取得 CA憑證資訊
 */
export function apiGetCaCertificate() {
  const api = `/certificate-management/ca`;
  return client.get(api);
}

/**
 *  刪除 CA憑證資訊
 *  @param {String} id
 */
export function apiDeleteCaCertificate(id) {
  const api = `/certificate-management/ca/delete`;
  const requestBody = {
    id
  };
  return client.post(api, requestBody);
}

/**
 *  上傳CA憑證資訊
 *  @param {file} certificate
 */
export function apiUploadCaCertificate(certificate) {
  const api = `/certificate-management/ca`;
  const formData = new FormData();
  formData.append('certificate', certificate);
  return client.post(api, formData);
}
