import { client } from '../axiosJson';
import { clientNoAuth } from '../axiosJsonNoAuth';

// ----------------------------------
//  personal setting - 個人設定選單
// ----------------------------------

/**
 * 取得使用者個人資料
 */
export function apiGetUserProfile() {
  const api = '/account-management/user/profile';
  return client.get(api);
}

/**
 * 更新使用者個人資料
 * @export
 * @param {String} name
 * @param {String} department
 * @param {String} phone
 * @param {String} ext
 * @returns
 */
export function apiUpdateUserProfile(name, department, phone, ext) {
  const api = '/account-management/user/profile/update';
  return client.post(api, {
    name: name,
    department: department,
    phone: phone,
    ext: ext
  });
}

/**
 * 取得密碼原則說明
 *  @param {Number} issuerBankId
 */
export function apiGetPasswordPrincipleDesc(issuerBankId) {
  const api = `/policy/mima/ui/desc/${issuerBankId}`;
  return clientNoAuth.get(api);
}

/**
 * 忘記密碼-發送「密碼設定連結」
 * @param {*} account
 */
export function apiSendChangePasswordMail(bankCode, account) {
  const api = '/mima/forget';
  return clientNoAuth.post(api, {
    bankCode,
    account
  });
}

/**
 * 忘記密碼-使用 email 連結更改密碼
 * NOTE: 新增使用者時，由後端直接寄送
 * @param {*} token
 * @param {*} newPassword
 */
export function apiChangePasswordFromLink(token, newPassword) {
  const api = '/mima/change/link';
  return clientNoAuth.post(api, {
    token: token,
    mima: newPassword
  });
}

/**
 * 變更密碼
 * @param {*} issuerBankId
 * @param {*} account
 * @param {*} currentPassword
 * @param {*} newPassword
 * @param {*} retypeNewPassword
 */
export function apiChangePassword(
  issuerBankId,
  account,
  currentPassword,
  newPassword,
  retypeNewPassword
) {
  const api = `/account-management/user/mima`;
  return client.post(api, {
    issuerBankId: issuerBankId,
    account: account,
    oldMima: currentPassword,
    newMima: newPassword,
    mimaConfirm: retypeNewPassword
  });
}
