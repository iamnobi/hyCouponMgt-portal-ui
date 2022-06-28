import { client } from '../axiosJson';

// ----------------------------------
//  system setting - permission
// ----------------------------------

/**
 *  登入成功後取得 該角色權限設定
 */
export function apiGetAccountPermission() {
  const api = `/permission/user`;
  return client.get(api);
}
