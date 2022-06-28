export const pagePermissionStore = {
  namespaced: true,
  state: {
    // TODO: make a /permission/user API model in the future
    pagePermissions: {}
  },
  actions: {
    async setPagePermissions({ commit }, payload) {
      let permissions = {};
      payload.routes.forEach(route => {
        switch (route.name) {
          case 'acquirerManage':
          case 'threedsSdk':
            permissions[route.name] = payload.permissions['acquirerBankQuery'];
            break;
          case 'issuerManage':
            permissions[route.name] = payload.permissions['bankManageQuery'];
            break;
          case 'generalSettings':
          case 'mcc':
            permissions[route.name] =
              payload.permissions['generalSettingQuery'];
            break;
          case 'roleGroupQuery':
            permissions[route.name] = payload.permissions['userGroupQuery'];
            break;
          case 'systemSettingCertificateSign':
          case 'systemSettingCertificateSSL':
            permissions[route.name] = payload.permissions['certQuery'];
            break;
          case 'transactionRecordDetail':
          case 'preqRecords':
            permissions[route.name] = payload.permissions['txQuery'];
            break;
          default:
            permissions[route.name] = payload.permissions[route.name];
            break;
        }
      });

      commit('savePagePermissions', permissions);
    }
  },
  mutations: {
    async savePagePermissions(state, payload) {
      state.pagePermissions = payload;
    }
  },
  getters: {
    getPagePermissions: state => {
      return state.pagePermissions;
    },
    getPagePermission: state => page => {
      return state.pagePermissions[page];
    }
  }
};
