import { GlobalConfig } from '../../config';
import { client } from '../axiosJson';

// ----------------------------------
//  bank management - 會員銀行管理
// ----------------------------------

/**
 * 取得 Issuer 列表
 *
 * @export
 * @return {*} Issuer 列表
 */
export function apiGetIssuers() {
  const api = `/bank-management/issuer-banks`;
  return client.get(api);
}

/**
 * 新增會員銀行
 *
 * @param {String} name
 * @param {String} code
 * @param {String} threeDSMethodUrl
 * @param {String} acsUrl
 * @param {String} acsRefNumber
 * @param {String} acsOperatorId
 * @return {*} Generic API response
 */
export function apiAddIssuer(
  name,
  code,
  threeDSMethodUrl,
  acsUrl,
  acsRefNumber,
  acsOperatorId
) {
  const api = `/bank-management/issuer-bank`;
  const requestBody = {
    name,
    code,
    threeDSMethodUrl,
    acsUrl,
    acsRefNumber,
    issuerBankId: GlobalConfig.MULTIBANKS_ORG_ID,
    acsOperatorId
  };
  return client.post(api, requestBody);
}

/**
 * 修改 Issuer
 *
 * @export
 * @param {Number} id
 * @param {String} name
 * @param {String} code
 * @param {String} threeDSMethodUrl
 * @param {String} acsUrl
 * @param {String} acsRefNumber
 * @return {*} Generic API response
 */
export function apiUpdateIssuer(
  id,
  name,
  code,
  threeDSMethodUrl,
  acsUrl,
  acsRefNumber
) {
  const api = `/bank-management/issuer-bank/update`;
  return client.post(api, {
    id: id,
    issuerBankId: GlobalConfig.MULTIBANKS_ORG_ID,
    name: name,
    code: code,
    threeDSMethodUrl: threeDSMethodUrl,
    acsUrl: acsUrl,
    acsRefNumber: acsRefNumber
  });
}

/**
 * 刪除 Issuer
 *
 * @param {Number} id - required
 * @return {*} Generic API response
 */
export function apiDeleteIssuer(id) {
  const api = `/bank-management/issuer-bank/delete`;
  const requestBody = {
    id,
    issuerBankId: GlobalConfig.MULTIBANKS_ORG_ID
  };
  return client.post(api, requestBody);
}

/**
 * 讀取 Issuer
 *
 * @param {Number} id - required, bank_id
 * @return {*} Issuer 資料
 */
export function apiGetIssuer(id) {
  const api = `/bank-management/issuer-bank/${id}`;
  return client.get(api);
}
