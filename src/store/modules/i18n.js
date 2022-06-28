import i18n from '@/plugins/i18n';

export const i18nStore = {
  namespaced: true,
  state: {
    lang: ''
  },
  mutations: {
    changeLang(state, lang) {
      i18n.locale = lang;
      state.lang = lang;
      localStorage.setItem('lang', lang);
    }
  },
  getters: {
    getLang: state => {
      return state.lang;
    },
    // moment.js locale file  https://github.com/moment/moment/tree/develop/locale
    // moment.js => zh-tw.js , zh-cn.js 兩者的locale 檔案為小寫
    momentLocaleLangName: state => {
      return state.lang.toLocaleLowerCase();
    }
  }
};
