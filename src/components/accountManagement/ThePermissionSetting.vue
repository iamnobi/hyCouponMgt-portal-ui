<template>
  <div>
    <v-alert class="my-3" type="error" :value="errorMessage">
      {{ errorMessage }}
    </v-alert>
    <v-card class="mt-4" xs12>
      <v-layout row wrap>
        <v-flex xs12>
          <h3 class="pa-4">
            {{ $t('page.account_groupPermission.permissionSetting.title') }}
            {{ groupName }}
          </h3>
          <v-divider></v-divider>
        </v-flex>
        <v-progress-linear
          v-if="loading"
          height="4"
          class="my-0"
          :indeterminate="true"
        ></v-progress-linear>

        <template>
          <div class="fixed-setting-area">
            <v-flex
              v-for="(permissionGroup, i) in permissionGroups"
              :key="i"
              xs12
              class="px-4"
            >
              <v-layout class="settingTitle">
                <v-flex xs12>
                  <h3 class="pt-3 pb-2 font-weight600">
                    {{ permissionGroup.name }}
                  </h3>
                </v-flex>
              </v-layout>

              <v-layout wrap class="settingSelect">
                <v-flex
                  xs4
                  v-for="(permission, j) in permissionGroup.permissions"
                  :key="j"
                >
                  <v-switch
                    color="primary"
                    hide-details
                    class="mt-2"
                    :id="permission.action"
                    @change="
                      checkModuleSetting(
                        permissionGroup.moduleName,
                        permission.action
                      )
                    "
                    :disabled="!userGroupModify"
                    :input-value="permissionData[permission.action]"
                    :label="permission.name"
                  ></v-switch>
                </v-flex>
              </v-layout>
            </v-flex>
          </div>
          <v-flex xs12 class="pb-3">
            <base-button-group
              :show-submit-btn="userGroupModify"
              @submit-search="submitGroupPermission"
              @reset-search-criteria="getCustomGroupPermission"
              :click-search-btn-once="true"
              :loading="sending"
            >
              <template slot="cancel">
                {{ $t('common.btn.cancel') }}
              </template>
              <template slot="submit">
                {{ $t('common.btn.save') }}
              </template>
            </base-button-group>
          </v-flex>
        </template>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import allModuleGroups from '@/utils/allModuleGroups';
import { alertNeedQueryPermission } from '@/mixins/alertTextCollection';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiGetCustomGroupPermission,
  apiUpdateCustomGroupPermission
} from '@/api/apiClient/accountManagement';

export default {
  inheritAttrs: false,

  mixins: [alertNeedQueryPermission],

  props: {
    groupName: {
      type: String
    },

    permissionGroups: {
      type: Array
    },

    selectGroupId: {
      type: Number
    },

    issuerBankId: {
      type: Number
    },

    userGroupModify: {
      type: Boolean
    },

    settingArea: {
      type: String
    }
  },

  data() {
    return {
      permissionData: {},
      loading: false,
      sending: false,
      errorMessage: null
    };
  },

  watch: {
    selectGroupId() {
      this.getCustomGroupPermission();
    }
  },

  created() {
    this.errorMessage = null;
    this.getCustomGroupPermission();
  },

  methods: {
    async getCustomGroupPermission() {
      try {
        this.loading = true;
        let response = await apiGetCustomGroupPermission(this.selectGroupId);
        this.permissionData = response.data.data;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
      this.$store.commit('changePermissionSetting', false, {
        module: 'roleGroup'
      });
    },

    async submitGroupPermission() {
      if (!this.userGroupModify) {
        alertUtil.noPermission();
        return;
      }

      this.sending = true;
      try {
        this.errorMessage = null;
        let criteria = Object.assign({}, this.permissionData);
        criteria['issuerBankId'] = this.issuerBankId;
        criteria['groupId'] = this.selectGroupId;

        await apiUpdateCustomGroupPermission(criteria);
        alertUtil.sendCompleteAlert();
        this.$emit('get-group-lists');
        this.$emit('update:settingArea', '');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
      this.$store.commit('changePermissionSetting', false, {
        module: 'roleGroup'
      });
    },

    checkModuleSetting(moduleName, actionName) {
      let status = this.permissionData[actionName];
      let domEl = document.getElementById(`${actionName}`);
      domEl.parentElement.classList.remove('fixed-switch');

      let moduleItems = allModuleGroups()
        .find(item => {
          return item.moduleName === moduleName;
        })
        ['permissions'].map(item => {
          return item.action;
        });

      this.$store.commit('changePermissionSetting', true, {
        module: 'roleGroup'
      });

      //檢視直接開關
      if (actionName.includes('Query') || status) {
        // 檢視關閉, 後面設定也要跟著直接關
        // TODO !status === false 改一下
        if (actionName.includes('Query') && !status === false) {
          moduleItems.forEach(actionName => {
            this.$set(this.permissionData, actionName, false);
          });
          return;
        }

        this.$set(this.permissionData, actionName, !status);

        return;
      }

      // 若檢視關閉, 編輯不能開啟
      if (!this.permissionData[moduleItems[0]] && !status) {
        this.$swal(this.alertNeedQueryPermission);
        domEl.parentElement.classList.add('fixed-switch');
        this.$set(this.permissionData, actionName, false);
        return;
      }

      this.$set(this.permissionData, actionName, !status);
    }
  }
};
</script>

<style lang="scss" scoped>
.settingTitle {
  border-bottom: 1px solid #dcdbdb;
}

.settingSelect {
  padding-bottom: 35px;
}

.fixed-setting-area {
  padding-top: 15px;
  height: 500px;
  width: 100%;
  overflow-y: auto;
}

::v-deep .fixed-switch .v-input--selection-controls__ripple,
::v-deep .fixed-switch .v-input--switch__thumb {
  transform: translate(0px, 0) !important;
}

::v-deep .fixed-switch {
  .v-input--selection-controls__ripple.primary--text {
    color: #bdbdbd !important;
  }

  .v-input--switch__thumb.primary--text {
    color: white !important;
  }

  .v-input--switch__track.primary--text {
    color: #bcbcbc !important;
  }
}
</style>
