import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en_Dictionary from '@/plugins/i18n/en.json';
import zh_TW_Dictionary from '@/plugins/i18n/zh-tw.json';
import { GlobalConfig } from '../config';

Vue.use(VueI18n);

const messages = {
  'zh-TW': zh_TW_Dictionary,
  en: en_Dictionary
};

const i18n = new VueI18n({
  locale: '',
  fallbackLocale: GlobalConfig.DEFAULT_LANG,
  messages,
  silentTranslationWarn: true
});

export default i18n;
