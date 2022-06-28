import { apiGetIssuers } from '@/api/apiClient/issuer';

export default {
  namespaced: true,

  state: {
    issuerBankNames: [],
    issuerBankCodes: [],
    selectedIssuerBanksId: null,
    selectedIssuerBanksName: null,
    loading: false
  },

  actions: {
    async getIssuerBanks({ commit }, payload) {
      commit('setLoading', true);
      try {
        let response = await apiGetIssuers(payload);
        let issuerBankNames = response.data.data.map(item => {
          return {
            id: item.id,
            issuerBankName: item.name
          };
        });

        let issuerBankCodes = response.data.data.map(item => {
          return {
            id: item.id,
            code: item.code
          };
        });

        commit('setIssuerBankNames', issuerBankNames);
        commit('setIssuerBankCodes', issuerBankCodes);
        commit('setLoading', true);

        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },

  mutations: {
    setIssuerBankNames(state, payload) {
      state.issuerBankNames = payload;
    },

    setIssuerBankCodes(state, payload) {
      state.issuerBankCodes = payload;
    },

    setSelectedIssuerBanksId(state, payload) {
      state.selectedIssuerBanksId = payload;
    },

    setSelectedIssuerBanksName(state, payload) {
      state.selectedIssuerBanksName = payload;
    },

    setLoading(state, payload) {
      state.loading = payload;
    }
  },

  getters: {
    selectIssuerBankName: state => {
      let arrayIssuerBankNamesArray = [...state.issuerBankNames];
      let item = arrayIssuerBankNamesArray.find(item => {
        if (item.id == state.selectedIssuerBanksId) {
          return item;
        }
      });

      return item ? item.issuerBankName : '';
    },

    selectIssuerBankId: state => {
      let arrayIssuerBankNamesArray = [...state.issuerBankNames];
      let item = arrayIssuerBankNamesArray.find(item => {
        if (item.issuerBankName == state.selectedIssuerBanksName) {
          return item;
        }
      });

      return item ? item.id : '';
    }
  }
};
