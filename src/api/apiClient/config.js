import { clientNoAuth } from '../axiosJsonNoAuth';

// ----------------------------------
//  Config
// ----------------------------------

/**
 * 取得後端Config設定
 */
export function apiUiConfig() {
  const api = `/ui-configuration`;
  return clientNoAuth.get(api);
}
