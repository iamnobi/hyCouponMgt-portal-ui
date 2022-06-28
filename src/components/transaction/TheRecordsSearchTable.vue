<template>
  <v-flex v-if="pageData" class="table-width-expand" xs12>
    <v-card>
      <v-layout align-center class="mt-4 py-2 px-2 white">
        <template>
          <h3 class="pl-3">
            {{ $t('page.transaction_records.3ds2Records.title') }}
          </h3>
          <base-sum-select-amount
            :total="pageData.total"
            :selected-amount="selected.length"
          ></base-sum-select-amount>
        </template>

        <v-spacer></v-spacer>

        <base-table-export
          :downloading="downloading"
          :selected-length="selected.length"
          @export-all-data="exportAllData"
          @export-select-data="exportSelectData"
        ></base-table-export>
      </v-layout>

      <v-divider></v-divider>

      <v-data-table
        ref="dTable"
        class="fixed-table-header"
        v-model="selected"
        hide-actions
        :items="pageData.data"
        :headers-length="9"
        :no-data-text="$t('common.table.noData')"
        item-key="id"
      >
        <template v-slot:headers>
          <tr>
            <th class="text-xs-left" style="width: 4%">
              <div class="select-box align-center">
                <v-checkbox
                  @change="setSelectedAll"
                  color="gray"
                  v-model="selectedAll"
                  primary
                  hide-details
                ></v-checkbox>
              </div>
            </th>
            <th class="text-xs-left" style="width: 15%">
              {{ $t('page.transaction_records.records.th_authenticationDate') }}
            </th>
            <th class="text-xs-left" style="width:11%">
              {{ $t('page.transaction_records.records.th_institutionName') }}
            </th>
            <th class="text-xs-left" style="width:9%">
              {{ $t('page.transaction_records.records.th_AcqBin') }}
            </th>
            <th class="text-xs-left" style="width:15%">
              {{ $t('page.transaction_records.records.th_pan') }}
            </th>
            <th class="text-xs-left" style="width: 9%">
              {{ $t('page.transaction_records.records.th_amount') }}
            </th>
            <th class="text-xs-left" style="width: 8%">
              {{ $t('page.transaction_records.records.th_currency') }}
            </th>
            <th class="text-xs-left" style="width: 11%">
              {{ $t('page.transaction_records.records.th_transactionResult') }}
            </th>
            <th class="text-xs-left" style="width: 16%">
              {{ $t('page.transaction_records.records.th_areqResult') }}
            </th>
            <th style="width: 2%"></th>
          </tr>
        </template>

        <template v-slot:items="itemProps">
          <tr @click="itemProps.expanded = !itemProps.expanded">
            <td style="width: 4%">
              <v-checkbox
                v-model="itemProps.selected"
                primary
                color="primary"
                hide-details
                @click.native="$event.cancelBubble = true"
              ></v-checkbox>
            </td>
            <template>
              <td class="cursor-pointer word-break-all" style="width: 15%">
                {{ itemProps.item.transTime | convertTimeToSecond }}
              </td>
              <td
                class="cursor-pointer word-break-all text-xs-left"
                style="width: 11%"
              >
                {{ itemProps.item.issuerName }}
              </td>
              <td
                class="cursor-pointer word-break-all text-xs-left"
                style="width: 9%"
              >
                {{ itemProps.item.acqBin }}
              </td>
              <td
                class="cursor-pointer word-break-all text-xs-left"
                style="width: 15%"
              >
                {{ itemProps.item.pan | panAddBlanks }}
              </td>
              <td class="cursor-pointer text-xs-left" style="width: 9%">
                {{ itemProps.item.amount | amountAddCommas }}
              </td>
              <td class="cursor-pointer text-xs-left" style="width: 8%">
                {{ itemProps.item.currency }}
              </td>
              <td class="cursor-pointer" style="width: 11%">
                {{ authenticationResult(itemProps.item.transactionResult) }}
                <div>
                  {{
                    $t('page.transaction_records.3ds2Records.td_ares', {
                      status: itemProps.item.ares
                    })
                  }}<br />
                  {{
                    $t('page.transaction_records.3ds2Records.td_rres', {
                      status: itemProps.item.rres
                    })
                  }}
                </div>
              </td>
              <td class="cursor-pointer word-break-all" style="width: 16%">
                {{
                  itemProps.item.failureReason
                    ? itemProps.item.failureReason
                    : '-'
                }}
              </td>
              <td style="width: 2%" class=" text-xs-right cursor-pointer px-1">
                <v-icon
                  :style="{ 'margin-left': '-32px' }"
                  :color="itemProps.expanded ? 'primary' : ''"
                  small
                  >more_horiz
                </v-icon>
              </td>
            </template>
          </tr>
        </template>

        <template v-slot:expand="expandProps">
          <the-records-search-expand
            :issuer-bank-id="formCriteria.issuerBankId"
            :transaction-id="expandProps.item.id"
            :errorMessage.sync="errorMessage"
          ></the-records-search-expand>
        </template>
      </v-data-table>

      <v-divider></v-divider>

      <div class="text-xs-center py-3">
        <v-pagination
          circle
          total-visible="10"
          v-model="currentPage"
          :length="pageData.totalPages"
        >
        </v-pagination>
      </div>
    </v-card>
  </v-flex>
</template>

<script>
import { alertExportOverLimit } from '@/mixins/alertTextCollection';

import TheRecordsSearchExpand from '@/components/transaction/TheRecordsSearchExpand.vue';
import { triggerDownload, downloadFileName } from '@/utils/downloadHelper.js';
import {
  apiExportAllTransactionData,
  apiExportSelectTransactionData
} from '@/api/apiClient/transaction';

export default {
  mixins: [alertExportOverLimit],

  props: {
    formCriteria: {
      type: Object
    },

    pageData: {
      type: Object
    },

    loading: {
      type: Boolean
    },

    errorMessage: {
      type: String
    }
  },

  components: {
    TheRecordsSearchExpand
  },

  data() {
    return {
      selectedAll: [],
      selected: [],

      downloading: false
    };
  },

  computed: {
    currentPage: {
      get() {
        return this.pageData.currentPage;
      },
      set(page) {
        this.selectedAll = [];
        this.selected = [];

        let criteria = Object.assign({}, this.formCriteria);
        criteria.page = page;
        this.$emit('query-transaction', criteria);
      }
    }
  },

  methods: {
    setSelectedAll() {
      this.selected = this.selectedAll.length ? [...this.pageData.data] : [];
    },

    async exportAllData() {
      if (this.pageData.total > 1000) {
        this.$swal(this.alertExportOverLimit);
        return;
      }

      this.$emit('update:errorMessage', null);

      this.downloading = true;
      try {
        let response = null;
        response = await apiExportAllTransactionData(this.formCriteria);

        if (response) {
          let filename = downloadFileName(response, 'Record');
          triggerDownload(filename, response.data);
        }
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }

      this.downloading = false;
    },

    async exportSelectData() {
      if (this.selected.length > 1000) {
        this.$swal(this.alertExportOverLimit);
      } else {
        this.$emit('update:errorMessage', null);
        this.downloading = true;
        const ids = this.selected.map(item => {
          return item.id;
        });

        try {
          let response = null;
          response = await apiExportSelectTransactionData(
            this.formCriteria.issuerBankId,
            ids,
            this.formCriteria.timeZone
          );

          if (response) {
            let filename = downloadFileName(response, 'Record');
            triggerDownload(filename, response.data);
          }
        } catch (error) {
          this.$emit('update:errorMessage', error.message);
        }
        this.downloading = false;
      }
    },

    authenticationResult(transactionResult) {
      switch (transactionResult) {
        case 'SUCCESS':
          return this.$t(
            'page.transaction_records.3ds2Records.td_result_success'
          );
        case 'FAIL':
          return this.$t('page.transaction_records.3ds2Records.td_result_fail');
        default:
          return '';
      }
    },

    closeDialog() {
      this.selectedAll = [];
      this.selected = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
}

.word-break-all {
  word-break: break-all;
}
</style>
