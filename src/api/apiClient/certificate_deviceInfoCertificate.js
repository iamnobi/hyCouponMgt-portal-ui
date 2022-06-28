import { client } from '../axiosJson';

// ----------------------------------
//  system setting - Device Info certificate
// ----------------------------------

/**
 *  取得 Device Info 憑證資訊
 */
export function apiGetDeviceInfoCertificate() {
  const api = `/certificate-management/signing`;
  return client.post(api, {});
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
export function apiCreateDeviceInfoGenKey(
  commonName,
  country,
  locality,
  organization,
  organizationUnit,
  stateOrProvince
) {
  const api = `/certificate-management/signing/gen-csr`;
  return client.post(api, {
    commonName,
    country,
    locality,
    organization,
    organizationUnit,
    stateOrProvince
  });
}

// note: 之後需要重新加附註
/**
 *  上傳 Device Info 憑證
 *  @param {file} certificate
 */
export function apiUploadDeviceInfoCertificate(certificateList) {
  const api = `/certificate-management/signing/upload`;
  const formData = new FormData();
  formData.append('certificateList', certificateList);
  return client.post(api, formData);
}

/**
 *  查詢可切換 Device Info 憑證列表
 */
export function apiGetDeviceInfoCertificateList() {
  const api = `/certificate-management/signing/cert-list`;
  return client.post(api, {});
}

/**
 *  切換 Device Info 憑證
 *  @param {Number} certId
 */
export function apiChangeDeviceInfoCertificate(certId) {
  const api = `/certificate-management/signing/change-cert`;
  return client.post(api, {
    certId
  });
}
