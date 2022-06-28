// ----------------------------------
// Global Config
// 全站共用設定
// NOTE: 請同步維護wiki文件
//
// use by $config
// ----------------------------------

const config = {
  // ----------------------------------
  // 客製化共用顯示開關設定
  // ----------------------------------
  // 是否使用多國語系
  USE_I18N: false,
  // 預設語系
  DEFAULT_LANG: 'en',

  // ----------------------------------
  // 客製化版面樣式
  // ----------------------------------
  LOGO_LOGIN_PATH: require('@/assets/cherri_w.svg'),
  LOGO_TOOLBAR_PATH: require('@/assets/cherri_w.svg'),
  KV_PATH: null, //require('@/assets/placeholder_kv.png'),
  SHOW_LOGO: true,

  // ----------------------------------
  // 共用參數
  // ----------------------------------
  // 語系清單
  LANGS: [
    { name: 'English', displayName: 'English', value: 'en' },
    { name: '繁體中文', displayName: '繁體中文', value: 'zh-TW' }
  ],
  // 預設組織代碼 (多銀行，ex. 財金)
  MULTIBANKS_ORG_ID: -1
};

export { config as GlobalConfig };
