import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls';
let ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

import issuerBanks from '@/store/modules/issuerBanks';
import roleGroup from '@/store/modules/roleGroup';
import { i18nStore } from './modules/i18n';
import { pagePermissionStore } from './modules/pagePermissionStore';

export default new Vuex.Store({
  // In strict mode any mutations to Vuex state outside of mutation handlers will throw an Error.
  strict: process.env.NODE_ENV !== 'production',

  state: {
    isIe11: false,
    storageCriteria: {},
    previousPageName: null,
    mfaPass: false,
    needUpdatePassword: false
  },

  mutations: {
    // 判別是否為 IE11
    changeIsIe11(state, value) {
      state.isIe11 = value;
    },

    changeMfaPass(state, value) {
      state.mfaPass = value;
    },

    changeNeedUpdatePassword(state, value) {
      state.needUpdatePassword = value;
    },

    // 儲存查詢條件
    setStorageCriteria(state, payload) {
      state.storageCriteria = payload;
    },

    // 設置查詢條件 null
    setNullStorageCriteria(state) {
      state.storageCriteria = Object.assign({});
    },

    setPreviousPageName(state, payload) {
      state.previousPageName = payload;
    }
  },

  getters: {
    getNeedUpdatePassword: state => {
      return state.needUpdatePassword;
    }
  },

  modules: {
    issuerBanks,
    roleGroup,
    i18nStore,
    pagePermissionStore
  },

  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      },
      // Note: 登出後，重置localStorage:vuex內容，以更新成最新的state
      reducer(val) {
        if (localStorage.getItem('x-csrf-token') === null) {
          return {};
        }
        return val;
      }
    })
  ]
});
