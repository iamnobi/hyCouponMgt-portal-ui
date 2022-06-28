<template>
  <base-dialog-info
    @close-dialog="closeDialog"
    :max-width="1000"
    :value="dialogRecordDetailState"
  >
    <template slot="dialogTitle">
      {{ $t('menu.transaction.sub.records') }}
    </template>
    <template slot="dialogSubTitle">
      {{ $t('page.transaction_records.dialog_recordDetail.description') }}
    </template>
    <template slot="dialogContent">
      <v-layout wrap>
        <v-flex xs12 class="pb-2">
          <v-alert :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>

        <v-flex xs12>
          <v-card>
            <v-layout align-center justify-start row px-2 py-3>
              <v-flex ml-2>
                <h3>
                  {{
                    $t(
                      'page.transaction_records.dialog_recordDetail.table_title'
                    )
                  }}
                </h3>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>

            <template v-if="loading">
              <div class="text-xs-center">
                <v-progress-circular
                  :size="50"
                  :width="6"
                  color="primary"
                  indeterminate
                >
                </v-progress-circular>
              </div>
            </template>

            <template v-if="!loading">
              <v-expansion-panel expand>
                <v-expansion-panel-content
                  v-for="(value, key) in transactionDetailData"
                  :key="key"
                >
                  <div slot="header">{{ key }}</div>
                  <v-card>
                    <v-card-text class="grey lighten-4">
                      <pre
                        v-if="value"
                        style="word-break: break-word;white-space: pre-wrap;"
                        >{{ value }}</pre
                      >
                      <span v-else>
                        {{
                          $t(
                            'page.transaction_records.dialog_recordDetail.th_none'
                          )
                        }}
                      </span>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </base-dialog-info>
</template>

<script>
import { apiGetTransactionDetailData } from '@/api/apiClient/transaction';

export default {
  props: {
    dialogRecordDetailState: {
      type: Boolean,
      default: false
    },

    transactionId: Number
  },

  data() {
    return {
      loading: false,
      transactionDetailData: {},

      errorMessage: null
    };
  },

  watch: {
    dialogRecordDetailState(val) {
      if (val) {
        this.getTransactionDetailData();
      }
    }
  },

  methods: {
    async getTransactionDetailData() {
      this.errorMessage = null;
      try {
        let response;
        response = await apiGetTransactionDetailData(this.transactionId);
        this.transactionDetailData = response.data.data;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    closeDialog() {
      this.errorMessage = null;
      this.$emit('update:dialogRecordDetailState', false);
    }
  }
};
</script>
