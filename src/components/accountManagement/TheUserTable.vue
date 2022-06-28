<template>
  <v-flex xs12>
    <v-alert class="mb-3" :value="errorMessage" type="error">
      {{ errorMessage }}
    </v-alert>

    <v-card>
      <v-layout align-center class="py-4 px-2 white">
        <base-sum-select-amount
          :total="pageData ? pageData.total : 0"
        ></base-sum-select-amount>
      </v-layout>

      <v-divider></v-divider>

      <v-data-table
        ref="dTable"
        class="fixed-table-header"
        hide-actions
        :items="pageData ? pageData.data : []"
        :headers-length="4"
        :no-data-text="$t('common.table.noData')"
        :loading="loading"
        item-key="id"
      >
        <template v-slot:headers>
          <tr>
            <th align="left" width="20%">
              {{ $t('page.account_userUnLock.unLockList.th_userAccount') }}
            </th>
            <th align="left" width="20%">
              {{ $t('page.account_userUnLock.unLockList.th_userName') }}
            </th>
            <th align="left" width="20%">
              {{ $t('page.account_userUnLock.unLockList.th_reason') }}
            </th>
            <th align="center" width="20%">
              {{ $t('page.account_userUnLock.unLockList.th_unlock') }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr>
            <td align="left" width="20%">{{ props.item.account }}</td>
            <td align="left" width="20%">{{ props.item.name }}</td>
            <td align="left" width="20%">{{ props.item.accountLockReason }}</td>
            <td align="center" width="20%">
              <v-btn
                :disabled="!unlockModify"
                @click="openUnlockConfirm(props.item.id)"
                flat
                color="error"
                class="mb-2"
              >
                <v-icon class="mr-2">lock</v-icon>
                <span class="vertical-align-text-bottom">
                  {{ $t('page.account_userUnLock.unLockList.btn_unlock') }}
                </span>
              </v-btn>
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
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import { confirmAccountUnlock } from '@/mixins/alertTextCollection.js';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiGetAccountLockUsers,
  apiUnlockAccount
} from '@/api/apiClient/accountManagement';

export default {
  mixins: [confirmAccountUnlock],

  data() {
    return {
      loading: false,
      errorMessage: null,
      pageData: null,
      issuerBankId: null
    };
  },

  computed: {
    getStoreIssuerBankId() {
      return getDecryptLocalStorage('issuerBankId');
    },

    unlockModify() {
      return getDecryptLocalStorage('permission').unlockModify;
    },

    currentPage: {
      get() {
        return this.pageData.currentPage;
      },
      set(page) {
        this.pageData.currentPage = page;
        this.getAccountLockUsers(page);
      }
    }
  },

  created() {
    // 取得登入時儲存的 issuerBankId
    if (this.getStoreIssuerBankId !== null) {
      this.issuerBankId = this.getStoreIssuerBankId;
    }

    this.getAccountLockUsers();
  },

  methods: {
    // 取得所有被鎖定帳號的user
    async getAccountLockUsers(page = 1) {
      this.loading = true;
      let criteria = {
        page,
        pageSize: 10,
        issuerBankId: this.issuerBankId
      };
      try {
        let response = await apiGetAccountLockUsers(criteria);
        this.pageData = response.data;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async openUnlockConfirm(userId) {
      let result = await this.$swal(this.confirmAccountUnlock);

      if (result.dismiss === 'cancel') {
        return;
      }

      this.errorMessage = null;
      try {
        await apiUnlockAccount(userId, this.issuerBankId);
        alertUtil.sendCompleteAlert();
        this.getAccountLockUsers(this.pageData.currentPage);
      } catch (error) {
        this.$swal(this.alertExecuteFail);
        this.errorMessage = error.message;
      }
    }
  }
};
</script>
