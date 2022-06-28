<template>
  <v-layout wrap>
    <dialog-bin-range
      :issuer-bank-id="issuerBankId"
      :dialog-bin-range-state.sync="dialogBinRangeState"
      :add-new-bin-range="addNewBinRange"
      :selected-item="selectedItem"
      @submit-form="submitBinRangeForm"
    ></dialog-bin-range>

    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.systemSetting.sub.binRange') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.systemSetting_binRange.description') }}
      </template>
    </base-page-title>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">{{
        errorMessage
      }}</v-alert>
    </v-flex>

    <!--NOTE: BinRange未來應該需要增加查詢條件，增加之後v-if條件要調整一下-->
    <v-flex xs12>
      <v-card class="py-2">
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs6>
              <base-banks-list
                :issuer-bank-id.sync="issuerBankId"
                :error-message="errorUnselectedBank"
              ></base-banks-list>
            </v-flex>
            <v-flex xs12>
              <base-button-group
                :disable-submit-btn="issuerBankId === multiBanksOrgId"
                :show-submit-btn="errors.items.length > 0 ? false : true"
                @reset-search-criteria="resetSearchCriteria"
                @submit-search="submitSearch"
                :click-search-btn-once="showResetBtn"
              ></base-button-group>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <v-flex
      xs12
      class="text-xs-center mt-3"
      v-if="!showSettingArea && circleLoading"
    >
      <v-progress-circular
        :size="70"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-flex>

    <v-flex xs12 v-if="showSettingArea">
      <v-card class="mt-3 pb-3">
        <v-layout align-center class="py-3 px-2 white" v-if="sysBinRangeModify">
          <v-btn
            @click="openBinRangeDialog(true)"
            round
            outline
            color="primary"
            class="mb-2"
          >
            <v-icon class="mr-2">add</v-icon>
            <span class="vertical-align-text-bottom">
              {{ $t('page.systemSetting_binRange.btn_addBinRange') }}
            </span>
          </v-btn>
        </v-layout>

        <v-divider></v-divider>
        <v-data-table
          ref="dTable"
          class="fixed-table-header"
          hide-actions
          :items="pageData ? pageData.data : []"
          :headers-length="6"
          :no-data-text="$t('common.table.noData')"
          :loading="loading"
          item-key="id"
        >
          <template v-slot:headers>
            <tr>
              <th align="left" width="30%">
                {{
                  $t(
                    'page.systemSetting_binRange.binRangeList.th_binRangeStart'
                  )
                }}
              </th>
              <th align="left" width="30%">
                {{
                  $t('page.systemSetting_binRange.binRangeList.th_binRangeEnd')
                }}
              </th>
              <th align="center" width="20%">
                {{ $t('page.systemSetting_binRange.binRangeList.th_edit') }}
              </th>
              <th align="center" width="20%">
                {{ $t('page.systemSetting_binRange.binRangeList.th_delete') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td align="left" class="no-one-line" width="30%">
                {{ props.item.startRange }}
              </td>
              <td align="left" class="no-one-line" width="30%">
                {{ props.item.endRange }}
              </td>
              <td align="center" width="20%">
                <template>
                  <v-icon
                    :disabled="!sysBinRangeModify"
                    @click="openBinRangeDialog(false, props.item)"
                    color="primary"
                    >create</v-icon
                  >
                </template>
              </td>
              <td align="center" width="20%">
                <template>
                  <base-delete-alert
                    :disable-delete-btn="!sysBinRangeModify"
                    @allow-delete="deleteBinRange(props.item.id)"
                  ></base-delete-alert>
                </template>
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
          ></v-pagination>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { GlobalConfig } from '@/config';
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import DialogBinRange from '@/components/systemSetting/DialogBinRange.vue';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiDeleteBinRange,
  apiQueryBinRange
} from '@/api/apiClient/systemSetting_binRange';

export default {
  components: {
    DialogBinRange
  },

  data() {
    return {
      multiBanksOrgId: GlobalConfig.MULTIBANKS_ORG_ID,
      issuerBankId: null,
      errorUnselectedBank: null,

      // v-data-table
      loading: false,
      circleLoading: false,

      // DialogBinRange
      addNewBinRange: true,
      dialogBinRangeState: false,
      selectedItem: {
        startRange: '',
        endRange: ''
      },

      // element control
      showSettingArea: false,
      showResetBtn: false,

      // pageData
      pageData: null,
      errorMessage: null
    };
  },

  computed: {
    sysBinRangeModify() {
      return getDecryptLocalStorage('permission').sysBinRangeModify;
    },

    currentPage: {
      get() {
        return this.pageData.currentPage;
      },
      set(page) {
        this.pageData.currentPage = page;
        this.queryBinRange(page);
      }
    }
  },

  watch: {
    issuerBankId() {
      this.errorUnselectedBank = null;
    }
  },

  created() {
    this.setInitialIssuerBankId();
  },

  methods: {
    setInitialIssuerBankId() {
      this.issuerBankId = getDecryptLocalStorage('issuerBankId');
    },

    resetSearchCriteria() {
      this.issuerBankId = getDecryptLocalStorage('issuerBankId');
      this.errorUnselectedBank = null;
      this.showResetBtn = false;
      this.showSettingArea = false;
      this.$validator.reset();
    },

    submitSearch() {
      const criteria = {
        issuerBankId: this.issuerBankId
      };
      this.$store.commit('setStorageCriteria', criteria);
      this.queryBinRange();
    },

    async queryBinRange(page = 1) {
      if (this.issuerBankId === null || this.issuerBankId == 0) {
        this.errorUnselectedBank = this.$t(
          'common.query.bank.hint_selectOneBank'
        );
        return;
      }

      this.loading = true;
      this.circleLoading = true;
      const criteria = {
        page,
        pageSize: 10,
        issuerBankId: this.issuerBankId
      };
      try {
        let response = await apiQueryBinRange(criteria);
        this.showSettingArea = true;
        this.pageData = response.data;
        this.errorMessage = null;
      } catch (error) {
        this.showSettingArea = false;
        this.errorMessage = error.message;
      }
      this.circleLoading = false;
      this.loading = false;
      this.showResetBtn = true;
    },

    async deleteBinRange(id) {
      if (!this.sysBinRangeModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        await apiDeleteBinRange(id, this.issuerBankId);
        alertUtil.sendCompleteAlert();
        this.queryBinRange(this.currentPage);
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    submitBinRangeForm() {
      this.queryBinRange(this.currentPage);
    },

    openBinRangeDialog(isNewBinRange, item) {
      this.dialogBinRangeState = true;
      this.addNewBinRange = isNewBinRange;
      this.selectedItem = item;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-pagination {
  /deep/ button:focus {
    outline: none;
  }
}

.no-one-line {
  word-break: break-word;
}
</style>
