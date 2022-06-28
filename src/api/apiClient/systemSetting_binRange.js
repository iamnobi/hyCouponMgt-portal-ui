import { client } from '../axiosJson';

// ----------------------------------
//  system setting - binRange
// ----------------------------------

/**
 *  查詢 BinRange
 *  criteria{
 *    page: int,// Required
 *    pageSize: int // Condition, 預設20筆
 *    issuerBankId: int,
 *  }
 */
export function apiQueryBinRange(criteria) {
  const api = `/system-setting/bin-range/query`;
  return client.post(api, criteria);
}

/**
 *  新增BIN Range
 *  criteria{
 *    issuerBankId: int,
 *    endRange: string, // 長度限制：13~19
 *    startRange: string, // 長度限制：13~19
 *  }
 */
export function apiAddBinRange(criteria) {
  const api = `/system-setting/bin-range`;
  return client.post(api, criteria);
}

/**
 *  編輯BIN Range
 *  criteria{
 *    id: int,
 *    issuerBankId: int,
 *    endRange: string, // 長度限制：13~19
 *    startRange: string, // 長度限制：13~19
 *  }
 */
export function apiUploadBinRange(criteria) {
  const api = `/system-setting/bin-range/update`;
  return client.post(api, criteria);
}

/**
 *  刪除BIN Range
 * @param {Number} id -
 * @param {Number} issuerBankId -
 * @param {Number} version -
 */
export function apiDeleteBinRange(id, issuerBankId) {
  const api = `/system-setting/bin-range/delete`;
  const requestBody = {
    id,
    issuerBankId
  };
  return client.post(api, requestBody);
}

// -------------
// note: before this line is complete
// -------------
