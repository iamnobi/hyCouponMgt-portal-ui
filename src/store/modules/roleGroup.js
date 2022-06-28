export default {
  namespace: true,

  state: {
    permissionSetting: false
  },

  mutations: {
    changePermissionSetting(state, payload) {
      state.permissionSetting = payload;
    }
  }
};
