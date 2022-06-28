import { client } from '../axiosJson';

// ----------------------------------
//  account management - unlock
// ----------------------------------

/**
 *  查詢被鎖定的使用者帳號
 *  criteria{
 *    page: int,// Required
 *    pageSize: int // Condition, 預設20筆
 *    issuerBankId: int,
 *  }
 */
export function apiGetAccountLockUsers(criteria) {
  const api = `/account-management/lock/user/list`;
  return client.post(api, criteria);
}

/**
 *  解鎖使用者帳號
 *  @param {Number}  id -
 *  @param {Number}  issuerBankId -
 */
export function apiUnlockAccount(id, issuerBankId) {
  const api = `/account-management/unlock/user`;
  const requestBody = {
    id,
    issuerBankId
  };
  return client.post(api, requestBody);
}

// ----------------------------------
//  account management - audit-logs
// ----------------------------------

/**
 *  查詢操作記錄
 *  @param {Object} criteria -
 *  criteria {
  *   page: int,
      pageSize:int,
      issuerBankId: int,
      startMillis: long, // required
      endMillis: long, // required
      account: "string",
      ip: "string",
      methodName: "string", // ex. signIn, optUnlock, rbaSetting,
      action: "string", // ex. Y, N ,T (timeout)
      errorCode: "string"
 *  }
 */
export function apiQueryAuditLogs(criteria) {
  const api = `/account-management/audit-log/list`;
  return client.post(api, criteria);
}

// ----------------------------------
//  account management - users
// ----------------------------------

/**
 * 取得使用者列表
 * @export
 * @param {Number} page
 * @param {Number} pageSize
 * @param {Number} issuerBankId
 * @param {String} account 使用者帳號 optional
 * @returns
 */
export function apiGetUserList(page, pageSize, issuerBankId, account) {
  const api = `/account-management/user/list`;
  return client.post(api, {
    page,
    pageSize,
    issuerBankId,
    account
  });
}

/**
 *  查詢所有群組名稱列表
 */
export function apiGetUserGroupList() {
  const api = '/account-management/user/group/list';
  return client.get(api);
}

/** 查詢單一使用者
 * @param  {Number} issuerBankId -
 * @param  {Number} userId -
 */
export function apiGetUser(issuerBankId, userId) {
  const api = `/account-management/user/${issuerBankId}/${userId}`;
  return client.get(api);
}

/**
 * 新增使用者
 * @export
 * @param {String} name
 * @param {String} account
 * @param {String} email
 * @param {StringArray} groupIdList
 * @param {String} department
 * @param {String} phone
 * @param {String} ext
 * @param {Number} issuerBankId
 * @returns
 */
export function apiCreateUser(
  name,
  account,
  email,
  groupIdList,
  department,
  phone,
  ext,
  issuerBankId
) {
  const api = `/account-management/user/create`;
  return client.post(api, {
    name,
    account,
    email,
    groupIdList,
    department,
    phone,
    ext,
    issuerBankId
  });
}

/**
 * 修改使用者
 * @export
 * @param {Number} id 使用者id
 * @param {String} name
 * @param {String} account
 * @param {String} email
 * @param {StringArray} groupIdList
 * @param {String} department
 * @param {String} phone
 * @param {String} ext
 * @param {Number} issuerBankId
 * @returns
 */
export function apiUpdateUser(
  id,
  name,
  account,
  email,
  groupIdList,
  department,
  phone,
  ext,
  issuerBankId
) {
  const api = `/account-management/user/update`;
  return client.post(api, {
    id,
    name,
    account,
    email,
    groupIdList,
    department,
    phone,
    ext,
    issuerBankId
  });
}

/**
 *  刪除使用者
 *  @param {Number} id -
 *  @param {Number} issuerBankId -
 */
export function apiDeleteUser(id, issuerBankId) {
  const api = `/account-management/user/delete`;
  const requestBody = {
    id,
    issuerBankId
  };
  return client.post(api, requestBody);
}

// ----------------------------------
//  account management - 群組管理
// ----------------------------------

/**
 * 取得銀行自訂的群組(Customized-bank)清單
 *  @param {Number} issuerBankId -
 */
export function apiGetCustomGroupList(issuerBankId) {
  const api = `/permission/group/bank/${issuerBankId}`;
  return client.get(api);
}

/**
 * 新增銀行群組(group)
 *  @param {Number} issuerBankId -
 *  @param {String} name -
 */
export function apiCreateCustomGroup(issuerBankId, name) {
  const api = `/permission/group/bank/create`;
  const requestBody = {
    issuerBankId,
    name
  };
  return client.post(api, requestBody);
}

/**
 * 刪除銀行群組(group)前的確認
 * NOTE: 取得會因為刪除群組而不屬於任何群組的成員清單
 *  @param {Number} issuerBankId
 *  @param {Number} groupId
 */
export function apiCheckDeleteCustomGroup(issuerBankId, groupId) {
  const api = `/permission/group/bank/delete/check`;
  const requestBody = {
    issuerBankId,
    groupId
  };

  return client.post(api, requestBody);
}

/**
 * 刪除銀行群組(group)
 *  @param {Number} issuerBankId
 *  @param {Number} groupId
 */
export function apiDeleteCustomGroup(issuerBankId, groupId) {
  const api = `/permission/group/bank/delete`;
  const requestBody = {
    issuerBankId,
    groupId
  };

  return client.post(api, requestBody);
}

/**
 * 修改群組名稱
 *  @param {Number} groupId -
 *  @param {String} name -
 */
export function apiUpdateCustomGroup(issuerBankId, groupId, name) {
  const api = `/permission/group/bank/update`;
  const requestBody = {
    issuerBankId,
    groupId,
    name
  };

  return client.post(api, requestBody);
}

/**
 * 取得群組(group)的模組列表
 *  @param {Number} groupId -
 */
export function apiGetCustomGroupPermission(groupId) {
  const api = `/permission/group/${groupId}`;
  return client.get(api);
}

/**
 *  編輯群組的模組功能
 *  criteria { 
 *    ... 權限列表
 *   moduleCert : boolean,
    certQuery : boolean,
    certEdit : boolean,
    certAudit : boolean
    ...
 *   }
 */
export function apiUpdateCustomGroupPermission(criteria) {
  const api = `/permission/group/update`;
  return client.post(api, criteria);
}

// note: 修改 - 會變成post 且有頁碼
/**
 * 取得群組成員清單
 *  @param {Number} groupId -
 *  @param {Number} page -
 *  @param {Number} pageSize -
 */
export function apiGetCustomGroupMembers(groupId, page, pageSize) {
  const api = `/permission/group/member/${groupId}`;
  let requestBody = {
    page,
    pageSize
  };
  return client.post(api, requestBody);
}

/**
 * 新增群組成員
 * @param { Number} issuerBankId -
 * @param {Number} groupId -
 * @param {String} account
 */
export function apiAddCustomGroupMember(issuerBankId, account, groupId) {
  const api = `/permission/group/member/create`;
  const requestBody = {
    issuerBankId,
    account,
    groupId
  };
  return client.post(api, requestBody);
}

/**
 * 移除群組成員
 * @param { Number} issuerBankId -
 * @param {Number} groupId -
 * @param {String} account
 */
export function apiDeleteCustomGroupMember(issuerBankId, account, groupId) {
  const api = `/permission/group/member/delete`;
  const requestBody = {
    issuerBankId,
    account,
    groupId
  };
  return client.post(api, requestBody);
}

// ----------------------------------
//  account management - 密碼原則管理
// ----------------------------------

/**
 *  查詢密碼原則管理UI欄位檢核條件
 */
export function apiGetFieldCheckConditions() {
  const api = `/policy/mima/ui/rule`;
  return client.get(api);
}

/**
 * 查詢密碼原則設定
 *  @param {Number} issuerBankId -
 */
export function apiGetPasswordPrinciple(issuerBankId) {
  const api = `/policy/mima/${issuerBankId}`;
  return client.get(api);
}

/**
 *  更新密碼原則設定
 *  criteria {
      id: Number,
      loginRetryCount: Number,
      mimaFreshInterval: Number,
      accountMaxIdleDay: Number,
      mimaHistoryDupCount: Number,
      mimaMinLength: Number,
      mimaMaxLength: Number,
      mimaAlphabetCount: Number,
      mimaMinUpperCase: Number,
      mimaMinLowerCase: Number,
      mimaMinNumeric: Number,
      mimaMinSpecialChar: Number,
 *  }
 */
export function apiUpdatePasswordPrinciple(issuerBankId, criteria) {
  const api = `/policy/mima/${issuerBankId}`;
  return client.post(api, criteria);
}
