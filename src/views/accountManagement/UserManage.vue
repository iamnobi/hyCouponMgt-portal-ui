<template>
  <v-layout wrap>
    <dialog-edit-user
      :dialog-edit-user-state.sync="dialogEditUserState"
      :is-new="isNew"
      :select-user-data="selectUserData"
      :issuer-bank-id="issuerBankId"
      @submit-form="getUserList(pageData.currentPage)"
    ></dialog-edit-user>

    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.account.sub.userManage') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.account_userManage.description') }}
      </template>
    </base-page-title>

    <v-flex xs12 v-if="errorMessage" class="pb-3">
      <v-alert :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <v-flex xs12 mb-4>
      <v-card>
        <v-layout align-center class="py-3 px-3 white">
          <v-flex>
            <v-btn
              :disabled="userGroupModify === false"
              @click="openEditUserDialog(true)"
              round
              outline
              color="primary"
              class="mb-2"
            >
              <v-icon class="mr-2">add</v-icon>
              <span class="vertical-align-text-bottom">
                {{ $t('page.account_userManage.btn_createUser') }}
              </span>
            </v-btn>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs3>
            <v-text-field
              v-model="account"
              prepend-inner-icon="search"
              :label="$t('page.account_userManage.label_accountSearch')"
              outline
              hide-details
              @input="getUserList(1)"
              class="search"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-layout>
          <v-flex pl-4 py-3>
            <h3>{{ $t('page.account_userManage.userList.title') }}</h3>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <v-data-table
          ref="userGroupTable"
          class="fixed-table-header"
          hide-actions
          :items="userList ? userList : []"
          :headers-length="5"
          :no-data-text="$t('common.table.noData')"
          :loading="loading"
          item-key="id"
        >
          <template v-slot:headers>
            <tr>
              <th align="left" width="20%">
                {{ $t('page.account_userManage.userList.th_userAccount') }}
              </th>
              <th align="left" width="20%">
                {{ $t('page.account_userManage.userList.th_userName') }}
              </th>
              <th align="left" width="20%">
                {{ $t('page.account_userManage.userList.th_roleGroup') }}
              </th>
              <th align="center" width="13%">
                {{ $t('page.account_userManage.userList.th_edit') }}
              </th>
              <th align="center" width="12%">
                {{ $t('page.account_userManage.userList.th_delete') }}
              </th>
            </tr>
          </template>

          <template slot="items" slot-scope="props">
            <tr>
              <td align="left" width="20%" class="word-break-all">
                {{ props.item.account }}
              </td>
              <td align="left" width="20%" class="word-break-all">
                {{ props.item.username }}
              </td>
              <td align="left" width="20%" class="word-break-all">
                {{ props.item.group }}
              </td>
              <td align="center" width="13%">
                <v-icon
                  :disabled="userGroupModify === false"
                  @click="openEditUserDialog(false, props.item)"
                  color="primary"
                >
                  create
                </v-icon>
              </td>
              <td align="center" width="12%">
                <base-delete-alert
                  :disable-delete-btn="userGroupModify === false"
                  @allow-delete="deleteUser(props.item.id)"
                  class="del_alert"
                >
                </base-delete-alert>
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-divider></v-divider>

        <div v-if="pageData" class="text-xs-center py-3">
          <v-pagination
            total-visible="10"
            circle
            v-model="currentPage"
            :length="pageData.totalPages"
          >
          </v-pagination>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import DialogEditUser from '@/components/accountManagement/DialogEditUser';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiDeleteUser,
  apiGetUserList
} from '@/api/apiClient/accountManagement';

export default {
  components: {
    DialogEditUser
  },

  data() {
    return {
      issuerBankId: null,
      account: '',
      pageData: null,
      userList: null,
      loading: false,
      errorMessage: null,

      isNew: true,
      selectUserData: {},
      dialogEditUserState: false
    };
  },

  computed: {
    getStoreIssuerBankId() {
      return getDecryptLocalStorage('issuerBankId');
    },

    userGroupModify() {
      return getDecryptLocalStorage('permission').userGroupModify;
    },

    currentPage: {
      get() {
        return this.pageData.currentPage;
      },
      set(page) {
        this.pageData.currentPage = page;
        this.getUserList(page);
      }
    }
  },

  created() {
    if (this.getStoreIssuerBankId !== null) {
      this.issuerBankId = this.getStoreIssuerBankId;
    }
    this.getUserList();
  },

  methods: {
    async getUserList(page = 1) {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await apiGetUserList(
          page,
          10,
          this.issuerBankId,
          this.account
        );
        this.pageData = response.data;
        this.userList = this.pageData.data;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async deleteUser(id) {
      if (!this.userGroupModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        await apiDeleteUser(id, this.issuerBankId);
        this.getUserList(this.pageData.currentPage);
        alertUtil.sendCompleteAlert();
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async openEditUserDialog(isNew, userItem) {
      this.isNew = isNew;
      this.selectUserData = userItem;
      this.dialogEditUserState = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.word-break-all {
  word-break: break-all;
}

.v-pagination {
  /deep/ button:focus {
    outline: none;
  }
}

.del_alert /deep/ button {
  margin-left: 5px;
}

.search /deep/ .v-input__slot {
  min-height: 18px;
  border-width: 1px !important;
  .v-input__prepend-inner {
    margin: auto;
  }
  label {
    top: 10px;
  }
  .v-label--active {
    top: 7px;
  }
  input {
    margin-top: 18px;
    padding: 0px;
  }
}
</style>
