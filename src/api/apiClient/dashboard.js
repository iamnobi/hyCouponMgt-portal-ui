import { client } from '../axiosJson';
import { clientBlob } from '../axiosBlob';

/**
 *  報表查詢 - 各交易狀態統計數值報表
 *  @param {Number} issuerBankId -
 *  @param {Number} year
 *  @param {Number} month
 *  @param {Number} [day]
 */
export function apiQueryStatisticReport(issuerBankId, year, month, day) {
  const api = `/report/statistic-report/transaction-status`;

  return day
    ? client.post(api, {
        issuerBankId,
        year,
        month,
        day
      })
    : client.post(api, {
        issuerBankId,
        year,
        month
      });
}

/**
 *  報表查詢 - 各交易狀態統計數值報表匯出
 *  @param {Number} issuerBankId -
 *  @param {Number} year
 *  @param {Number} month
 *  @param {Number} [day]
 */
export function apiExportStatisticReport(issuerBankId, year, month, day) {
  const api = `/report/statistic-report/transaction-status/export/xls`;

  return day
    ? clientBlob.post(api, {
        issuerBankId,
        year,
        month,
        day
      })
    : clientBlob.post(api, {
        issuerBankId,
        year,
        month
      });
}
