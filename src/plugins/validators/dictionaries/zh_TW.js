const formatFileSize = size => {
  const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const threshold = 1024;
  size = Number(size) * threshold;
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return `${(size / Math.pow(threshold, i)).toFixed(2) * 1} ${units[i]}`;
};

// Original Message
const messages = {
  _default: field => `${field} 無效`,
  after: (field, [target]) => `${field} 必須要晚於 ${target}`,
  alpha: field => `${field} 只能以字母組成`,
  alpha_dash: field => `${field} 只能以字母、數字及斜線組成`,
  alpha_num: field => `${field} 只能以字母及數字組成`,
  alpha_spaces: field => `${field} 只能以字母及空格組成`,
  before: (field, [target]) => `${field} 必須要早於 ${target}`,
  between: (field, [min, max]) => `${field} 必須介於 ${min} 至 ${max}之間`,
  confirmed: (field, [confirmedField]) =>
    `${field} 與 ${confirmedField} 輸入的不一致`,
  credit_card: field => `${field} 的格式錯誤`,
  date_between: (field, [min, max]) => `${field} 必須在 ${min} 和 ${max} 之間`,
  date_format: (field, [format]) => `${field} 不符合 ${format} 的格式`,
  decimal: (field, [decimals = '*'] = []) =>
    `${field} 必須是數字，而且能夠保留${
      !decimals || decimals === '*' ? '' : ' ' + decimals
    } 位小數`,
  digits: (field, [length]) => `${field} 必須是 ${length} 位數字`,
  dimensions: (field, [width, height]) =>
    `${field} 圖片尺寸不正確必須是 ${width} 像素到 ${height} 像素`,
  email: field => `${field} 必須是有效的電子郵件地址`,
  excluded: field => `所選擇的 ${field} 選項無效`,
  ext: field => `${field} 必須是有效的檔案`,
  image: field => `${field} 必須是一張圖片`,
  included: field => `所選擇的 ${field} 選項無效`,
  integer: field => `${field} 必須是整數`,
  ip: field => `${field} 必須是一個有效的 IP 位址`,
  length: (field, [length]) => `${field} 長度必須為 ${length}`,
  // length: (field, [length, max]) => {
  //   if (max) {
  //     return `${field} 的長度必須在 ${length} 到 ${max} 之間`;
  //   }

  //   return `${field} 的長度必須為 ${length}`;
  // },
  max: (field, [length]) => `${field} 不能大於 ${length} 個字元`,
  max_value: (field, [max]) => `${field} 不得大於 ${max}`,
  mimes: field => `${field} 必須是有效的檔案類型.`,
  min: (field, [length]) => `${field} 不能小於 ${length} 個字元`,
  min_value: (field, [min]) => `${field} 不得小於 ${min}`,
  numeric: field => `${field} 只能輸入數字字符`,
  regex: field => `${field} 的格式錯誤`,
  required: field => `${field} 不能留空`,
  size: (field, [size]) => `${field} 的大小必須小於 ${formatFileSize(size)}.`,
  url: field => `${field} 的格式錯誤`
};

// Field-specific Custom Messages,
const custom = {
  demoCustomRule: {
    demoCustomRule: field => `${field} 測試客製化規則`
  },
  login_bankCode: {
    required: () => '請輸入銀行代碼'
  },
  login_useraccount: {
    required: () => '請輸入使用者帳號'
  },
  login_password: {
    required: () => '請輸入密碼'
  },
  must: {
    required: () => '此欄位為必填欄位'
  },
  bankCode: {
    required: () => '代碼不能為空',
    min: () => '長度最少3碼',
    numeric: () => '只能是數字'
  },

  // key is field name, ex: feePerMonth => name: 'feePerMonth'
  // checkIsMoreThanFourDecimal => 相對應於Validator.extand 檢驗的方法, 在程式中使用方式 v-validate="checkIsMoreThanFourDecimal"
  feePerMonth: {
    checkIsMoreThanFourDecimal: () =>
      '請輸入正確的數字,且不能輸入超過小數點第四位'
  },

  perTransactionFee: {
    checkIsMoreThanFourDecimal: () =>
      '請輸入正確的數字,且不能輸入超過小數點第四位'
  },

  thresholdFee: {
    checkIsMoreThanTwoDecimal: () =>
      '請輸入正確的數字,且不能輸入超過小數點第二位'
  },

  minimumFee: {
    checkIsMoreThanFourDecimal: () =>
      '請輸入正確的數字,且不能輸入超過小數點第四位'
  },

  checkoutIpv4: {
    checkoutIpv4: () => '請輸入IPV4格式'
  },

  checkoutIpv6: {
    checkoutIpv6: () => '請輸入IPV6格式'
  },

  checkIsMin256bitsAscii: {
    required: () => 'ASCII碼不能為空',
    checkIsAscii: () => `請輸入正確的ASCII碼`,
    length: () => '長度必須為256bits'
  },

  checkOtpVerifyMsg: {
    checkOtpVerifyMsg: field => `${field} 必須包含驗證安全碼(authCode)`
  }
};

const locale = {
  name: 'zh_TW',
  messages,
  attributes: {},
  custom
};

export default locale;
