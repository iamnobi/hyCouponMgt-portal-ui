import { client } from '../axiosJson';

// ----------------------------------
//  MFA
// ----------------------------------

/**
 * 發送 MFA OTP Mail
 * criteria{
 *    issuerBankId: Int,
 *    account: String,
 *  }
 */
export function apiSendMfaOtpMail(criteria) {
  const api = '/mfa/send';
  return client.post(api, criteria);
}

/**
 * MFA OTP 驗證
 * criteria{
 *    issuerBankId: Int,
 *    account: String,
 *    authenticationCode: String
 *  }
 */
export function apiVerificationMfaOtp(criteria) {
  const api = '/mfa/verification';
  return client.post(api, criteria);
}
