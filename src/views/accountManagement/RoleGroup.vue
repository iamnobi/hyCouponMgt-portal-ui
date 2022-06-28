<template>
  <v-layout wrap>
    <dialog-add-group
      @get-group-lists="getGroupLists"
      :user-group-modify="userGroupModify"
      :issuer-bank-id="issuerBankId"
      :dialog-add-group-state.sync="dialogAddGroupState"
      :is-new-group-dialog="isNewGroupDialog"
      :select-group-id="selectGroupId"
      :select-group-name="selectGroupName"
    ></dialog-add-group>

    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.account.sub.groupPermission') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.account_groupPermission.description') }}
      </template>
    </base-page-title>

    <v-flex xs12 class="mb-4">
      <v-card class="pb-4">
        <v-layout wrap>
          <v-flex xs12 class="py-1" v-if="userGroupModify">
            <v-btn
              @click="openAddGroupDialog(true)"
              round
              outline
              color="primary"
              class="my-3 ml-3"
            >
              <v-icon>add</v-icon>
              {{ $t('page.account_groupPermission.btn_createRoleGroup') }}
            </v-btn>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-layout>
          <v-flex pl-4 py-3>
            <h3>
              {{ $t('page.account_groupPermission.roleGroupList.title') }}
            </h3>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <v-data-table
          class=" fixed-table-header"
          hide-actions
          :items="groupLists ? groupLists : []"
          :headers-length="4"
          :no-data-text="$t('common.table.noData')"
          :loading="loading"
          item-key="groupId"
        >
          <template v-slot:headers="props">
            <tr :class="props.thead">
              <th align="left" width="25%">
                {{
                  $t('page.account_groupPermission.roleGroupList.th_groupName')
                }}
              </th>
              <th align="center" width="25%">
                {{ $t('page.account_groupPermission.roleGroupList.th_member') }}
              </th>
              <th align="center" width="15%">
                {{
                  $t('page.account_groupPermission.roleGroupList.th_setting')
                }}
              </th>
              <th align="center" width="15%">
                {{ $t('page.account_groupPermission.roleGroupList.th_delete') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td width="25%" class="word-break-all">
                <div class="d-inline-flex align-center">
                  <span>{{ props.item.name }}</span>
                  <v-btn
                    @click="openAddGroupDialog(false, props.item)"
                    :disabled="!userGroupModify"
                    icon
                    ><v-icon color="primary">edit</v-icon></v-btn
                  >
                </div>
              </td>
              <td align="center" width="25%">
                <div class="d-inline-flex align-center">
                  <v-btn
                    icon
                    :disabled="!userGroupModify"
                    @click="showSettingArea(props.item, 'members_area')"
                    ><v-icon color="primary">person_add</v-icon></v-btn
                  >
                  <span
                    @click="showSettingArea(props.item, 'members_area')"
                    class="cursor-pointer grey--text text--darken-1"
                    >{{ props.item.members }}</span
                  >
                </div>
              </td>
              <td align="center" width="15%">
                <v-btn
                  icon
                  @click="showSettingArea(props.item, 'permission_area')"
                  ><v-icon color="primary">settings</v-icon></v-btn
                >
              </td>
              <td align="center" width="15%">
                <base-delete-alert
                  :disable-delete-btn="!userGroupModify"
                  @allow-delete="checkDeleteCustomGroup(props.item.groupId)"
                ></base-delete-alert>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
      </v-card>
    </v-flex>

    <v-flex xs12 id="permission_area">
      <div v-if="settingArea == 'permission_area'">
        <the-permission-setting
          :setting-area.sync="settingArea"
          :user-group-modify="userGroupModify"
          :permission-groups="permissionGroups"
          :group-name="selectGroupName"
          :issuer-bank-id="issuerBankId"
          :select-group-id="selectGroupId"
          @get-group-lists="getGroupLists"
        ></the-permission-setting>
      </div>
    </v-flex>

    <v-flex xs12 id="members_area">
      <div v-if="settingArea == 'members_area'">
        <the-members-setting
          :user-group-modify="userGroupModify"
          :group-name="selectGroupName"
          :select-group-id="selectGroupId"
          :issuer-bank-id="issuerBankId"
          @remove-member="getGroupLists"
          @add-member="getGroupLists"
        >
        </the-members-setting>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import ThePermissionSetting from '@/components/accountManagement/ThePermissionSetting.vue';
import TheMembersSetting from '@/components/accountManagement/TheMembersSetting.vue';
import DialogAddGroup from '@/components/accountManagement/DialogAddGroup.vue';
import allModuleGroups from '@/utils/allModuleGroups';
import { confirmMemberWillNoGroup } from '@/mixins/alertTextCollection.js';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiCheckDeleteCustomGroup,
  apiDeleteCustomGroup,
  apiGetCustomGroupList
} from '@/api/apiClient/accountManagement';

export default {
  mixins: [confirmMemberWillNoGroup],

  components: {
    DialogAddGroup,
    TheMembersSetting,
    ThePermissionSetting
  },

  data() {
    return {
      loading: false,
      errorMessage: null,
      isNewGroupDialog: true,
      dialogAddGroupState: false,

      groupLists: null,

      selectGroupId: null,
      selectGroupName: '',
      issuerBankId: null,

      settingArea: '',
      permissionGroups: []
    };
  },

  computed: {
    ...mapGetters({
      getLanguage: 'i18nStore/getLang'
    }),

    userGroupModify() {
      return getDecryptLocalStorage('permission').userGroupModify;
    }
  },

  watch: {
    getLanguage() {
      this.setPremissionGroups();
    }
  },

  created() {
    this.setInitialIssuerBankId();
    this.getGroupLists();
    this.setPremissionGroups();
  },

  methods: {
    setInitialIssuerBankId() {
      this.issuerBankId = getDecryptLocalStorage('issuerBankId');
    },

    async getGroupLists() {
      this.loading = true;
      try {
        let response = await apiGetCustomGroupList(this.issuerBankId);
        this.groupLists = response.data.data;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async checkDeleteCustomGroup(groupId) {
      if (!this.userGroupModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        let response = await apiCheckDeleteCustomGroup(
          this.issuerBankId,
          groupId
        );

        let userAccounts = response.data.data;
        let userAccountCount = userAccounts ? userAccounts.length : 0;

        if (userAccountCount === 0) {
          this.deleteCustomGroup(groupId);
        } else {
          this.$swal(
            this.confirmMemberWillNoGroup(userAccounts.join(', '))
          ).then(async result => {
            if (result.value) {
              this.deleteCustomGroup(groupId);
            }
          });
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async deleteCustomGroup(groupId) {
      try {
        await apiDeleteCustomGroup(this.issuerBankId, groupId);
        alertUtil.sendCompleteAlert();
        this.settingArea = '';
        this.getGroupLists();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    showSettingArea(item, settingArea) {
      this.selectGroupName = item.name;
      this.selectGroupId = Number(item.groupId);
      this.settingArea = settingArea;
      const targetID = document.querySelector(`#${settingArea}`);
      this.scrollToSpecificArea(targetID);
    },

    setPremissionGroups() {
      let allModuleGroupsArray = allModuleGroups();

      // 取得該人員的權限，並篩選出有權限的module清單
      let permission = getDecryptLocalStorage('permission');

      let moduletList = [];
      for (let item in permission) {
        if (item.includes('module') && permission[item]) {
          moduletList.push(item);
        }
      }

      this.permissionGroups = allModuleGroupsArray.filter(item =>
        moduletList.includes(item.moduleName)
      );
    },

    // scroll to particular area
    scrollToSpecificArea(targetID, offset = '-100') {
      // eslint-disable-next-line
      Velocity(targetID, 'scroll', {
        duration: 200,
        delay: 100,
        offset: `${offset}px`
      });
    },

    openAddGroupDialog(isNew, item) {
      this.dialogAddGroupState = true;
      this.isNewGroupDialog = isNew;
      if (!isNew) {
        this.selectGroupId = item.groupId;
        this.selectGroupName = item.name;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.word-break-all {
  word-break: break-all;
}
</style>
