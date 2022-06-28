import { client } from '../axiosJson';
import { clientBlob } from '../axiosBlob';

// ----------------------------------
//        transaction - 3DS 2.0
// ----------------------------------

/**
 * To query transaction records
 * @param {Object} filter - query filters
 */
export function apiQueryTransaction(filter = {}) {
  const api = '/transaction/record';
  const requestBody = filter;
  return client.post(api, requestBody);
}

/**
 * To query transaction records expand content
 * @param {Number} issuerBankId -
 * @param {String} transactionLogId -
 */
export function apiGetTransactionExpandData(issuerBankId, transactionLogId) {
  const api = `/transaction/record/summary`;

  const requestBody = {
    issuerBankId,
    transactionLogId
  };
  return client.post(api, requestBody);
}

/**
 * To query transaction records detail content
 * @param {Number} id - id
 */
export function apiGetTransactionDetailData(id) {
  const api = `/transaction/record/detail/${id}`;
  return client.get(api);
}

/**
 * @param {Object} formFilter - transaction search criteria
 */
export function apiExportAllTransactionData(formFilter) {
  const api = `/transaction/record/query/export/xls`;
  return clientBlob.post(api, formFilter);
}

/**
 * 3DS 2.0 全部匯出
 * @param {Number} issuerBankId
 * @param {Array} ids - 選擇的ID
 * @param {String} timeZone
 */
export function apiExportSelectTransactionData(issuerBankId, ids, timeZone) {
  const api = `/transaction/record/export/xls`;
  return clientBlob.post(api, {
    issuerBankId,
    ids,
    timeZone
  });
}

// ----------------------------------
//    PReq Records
// ----------------------------------

/**
 * To query PReq records
 * @param {Object} criteria
 */
export function apiQueryPReqRecords(criteria = {}) {
  const api = '/preparation/record';
  return client.post(api, criteria);
}
