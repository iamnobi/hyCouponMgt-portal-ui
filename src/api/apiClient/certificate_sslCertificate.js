import { client } from '../axiosJson';
import { clientBlob } from '../axiosBlob';

// ----------------------------------
//  system setting - ssl certificate
// ----------------------------------

/**
 *  取得 SSL憑證資訊
 */
export function apiGetSSLCertificate() {
  const api = `/certificate-management/ssl`;
  return client.get(api);
}

/**
 * create genKey
 * @param {String} commonName
 * @param {String} country
 * @param {String} locality
 * @param {String} organization
 * @param {String} organizationUnit
 * @param {String} stateOrProvince
 */
export function apiCreateSslGenKey(
  commonName,
  country,
  locality,
  organization,
  organizationUnit,
  stateOrProvince
) {
  const api = `/certificate-management/ssl/gen-key`;
  return client.post(api, {
    commonName,
    country,
    locality,
    organization,
    organizationUnit,
    stateOrProvince
  });
}

/**
 * delete genKey
 */
export function apiDeleteGenKey() {
  const api = `/certificate-management/ssl/delete/tmp-key`;
  return client.post(api);
}

/**
 * upload ssl certificate
 * @param {File} file - the certificate file
 */

export function apiUploadCertificate({ file }) {
  const api = `/certificate-management/ssl/upload/cert`;
  const formData = new FormData();
  formData.append('certificate', file);
  return client.post(api, formData);
}

/**
 * create renew genKey
 */
export function apiCreateRenewSslGenKey(
  commonName,
  country,
  locality,
  organization,
  organizationUnit,
  stateOrProvince
) {
  const api = `/certificate-management/ssl/renew/key`;
  return client.post(api, {
    commonName,
    country,
    locality,
    organization,
    organizationUnit,
    stateOrProvince
  });
}

/**
 * renew  upload ssl certificate
 * @param {Number} id -
 * @param {File} file - the certificate file
 */
export function apiRenewCertificate({ file, id }) {
  const api = `/certificate-management/ssl/renew/cert`;
  const formData = new FormData();
  formData.append('id', id);
  formData.append('certificate', file);
  return client.post(api, formData);
}

/**
 *  下載 SSL憑證
 * @param {String} password -
 */
export function apiDownloadSslCertificate(password) {
  const api = `/certificate-management/ssl/download/p12`;
  const requestBody = {
    password
  };

  return clientBlob.post(api, requestBody);
}

/**
 *  查詢可切換 SSL 憑證列表
 */
export function apiGetSslCertificateList() {
  const api = `/certificate-management/ssl/cert-list`;
  return client.post(api, {});
}

/**
 *  切換 SSL 憑證
 *  @param {Number} certId
 */
export function apiChangeSslCertificate(certId) {
  const api = `/certificate-management/ssl/change-cert`;
  return client.post(api, {
    certId
  });
}
