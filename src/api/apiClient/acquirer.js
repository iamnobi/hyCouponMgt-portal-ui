import { client } from '../axiosJson';

/**
 * 取得 acquirer 下拉清單
 *
 * @export
 * @return {*} The list of acquirers
 */
export function apiGetAcquirersList() {
  const api = `/acquirer-bank/list`;
  return client.get(api);
}

/**
 * 取得 acquirer 列表
 *
 * @export
 * @return {*} The list of acquirers
 */
export function apiGetAcquirers() {
  const api = `/acquirer-bank/`;
  return client.get(api);
}

/**
 * 新增 acquirer
 *
 * @export
 * @param {String} name New acquirer name
 * @param {String} threeDSServerRefNumber 3DS reference number
 * @param {String} threeDSOperatorId 3DS Operator ID
 * @return {*} Generic API response
 */
export function apiAddAcquirer(
  name,
  threeDSServerRefNumber,
  threeDSOperatorId
) {
  const api = `/acquirer-bank/create`;
  return client.post(api, {
    name,
    threeDSServerRefNumber,
    threeDSOperatorId
  });
}

/**
 * 更新 acquirer
 *
 * @export
 * @param {Number} id Acquirer id
 * @param {String} name Acquirer name
 * @param {String} threeDSServerRefNumber 3DS reference number
 * @return {*} Generic API response
 */
export function apiEditAcquirer(id, name, threeDSServerRefNumber) {
  const api = `/acquirer-bank/edit`;
  return client.post(api, {
    id,
    name,
    threeDSServerRefNumber
  });
}

/**
 * 刪除 acquirer
 *
 * @export
 * @param {Number} id Acquirer id
 * @return {*} Generic API response
 */
export function apiDeleteAcquirer(id) {
  const api = `/acquirer-bank/delete`;
  return client.post(api, {
    id
  });
}

/**
 * 用 acquirer id 查所屬的 BINs
 *
 * @export
 * @param {Number} id Acquirer id
 * @return {*} The list of BINs belong to acquirer
 */
export function apiGetAcquirerBins(id) {
  const api = `/acquirer-bank/bin`;
  return client.post(api, {
    id
  });
}

/**
 * 新增 acquirer 所屬的 BIN
 *
 * @export
 * @param {Number} id Acquirer id
 * @param {String} acquirerBin Acquirer BIN number
 * @return {*} Generic API response
 */
export function apiAddAcquirerBin(id, acquirerBin) {
  const api = `/acquirer-bank/bin/create`;
  return client.post(api, {
    id,
    acquirerBin
  });
}

/**
 * 刪除 acquirer BIN
 *
 * @export
 * @param {Number} id The Acquirer BIN's data id
 * @return {*} Generic API response
 */
export function apiDeleteAcquirerBin(id) {
  const api = `/acquirer-bank/bin/delete`;
  return client.post(api, {
    id
  });
}

/**
 * 查詢 acquirer 的 SDK
 *
 * @export
 * @return {*} The list of SDK
 */
export function apiGet3DSSdk() {
  const api = `/acquirer-bank/3ds-sdk`;
  return client.get(api);
}

/**
 * 新增 acquirer 的 SDK 資訊
 *
 * @export
 * @param {String} sdkRefNumber SDK Reference Number
 * @return {*} Generic API response
 */
export function apiAdd3DSSdk(sdkRefNumber) {
  const api = `/acquirer-bank/3ds-sdk/create`;
  return client.post(api, {
    sdkRefNumber
  });
}

/**
 * 刪除 acquirer 的 SDK
 *
 * @export
 * @param {Number} id The SDK data id
 * @return {*} Generic API response
 */
export function apiDelete3DSSdk(id) {
  const api = `/acquirer-bank/3ds-sdk/delete`;
  return client.post(api, {
    id
  });
}
