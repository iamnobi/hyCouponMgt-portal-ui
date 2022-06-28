import { clientNoAuth } from '../axiosJsonNoAuth';

// ----------------------------------
//  login
// ----------------------------------

/**
 *  登入
 *  @param { String } account
 *  @param { String } password
 *  @param { Number } bankCode
 */
export function apiLogin(criteria) {
  const api = `/login`;
  const formData = new FormData();
  formData.append('account', criteria.account);
  formData.append('password', criteria.password);
  formData.append('bankCode', criteria.bankCode);
  formData.append('recaptchaToken', criteria.recaptchaToken);
  return clientNoAuth.post(api, formData);
}

// ----------------------------------
//  logout
// ----------------------------------

/**
 *  登出
 */
export function apiLogout() {
  const api = `/logout`;
  return clientNoAuth.get(api);
}
