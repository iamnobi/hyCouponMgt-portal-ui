<template>
  <div class="grey lighten-4 ">
    <dialog-record-detail
      :dialog-record-detail-state.sync="dialogRecordDetailState"
      :transaction-id="transactionId"
    ></dialog-record-detail>

    <template v-if="loading">
      <v-progress-linear
        class="my-0"
        :height="4"
        :color="loading ? 'primary' : 'transparent'"
        :indeterminate="true"
      ></v-progress-linear>
    </template>

    <template v-else>
      <v-layout class="bottom-line pb-2" wrap>
        <v-flex class="sub">
          <div>
            <v-subheader class="primary--text">
              {{ $t('page.transaction_records.recordsExtend.th_cardholderIp') }}
            </v-subheader>
            <div class="px-3" v-if="transactionExpanedData.ip">
              {{ transactionExpanedData.ip }}
            </div>
            <div class="px-3 grey--text " v-else>
              {{ $t('page.transaction_records.recordsExtend.th_none') }}
            </div>
          </div>
        </v-flex>

        <v-flex class="sub">
          <div>
            <v-subheader class="primary--text"
              >{{
                $t('page.transaction_records.recordsExtend.th_purchaseTime')
              }}
            </v-subheader>
            <div class="px-3" v-if="transactionExpanedData.shoppingTime">
              {{ transactionExpanedData.shoppingTime | convertTimeToSecond }}
            </div>
            <div class="px-3 grey--text " v-else>
              {{ $t('page.transaction_records.recordsExtend.th_none') }}
            </div>
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_merchantName') }}
          </v-subheader>

          <div class="px-3" v-if="transactionExpanedData.merchantName">
            {{ transactionExpanedData.merchantName }}
          </div>
          <div class="px-3 grey--text " v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{
              $t(
                'page.transaction_records.recordsExtend.th_merchantCountryCode'
              )
            }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.merchantCountryCode">
            {{ transactionExpanedData.merchantCountryCode }}
          </div>
          <div class="px-3 grey--text " v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>
      </v-layout>

      <v-layout class="bottom-line mt-10 pb-2" wrap>
        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{
              $t('page.transaction_records.recordsExtend.th_challengeChannel')
            }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.challengeOtpChannel">
            {{ transactionExpanedData.challengeOtpChannel }}
          </div>
          <div class="px-3 grey--text " v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_deviceChannel') }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.deviceChannel">
            {{ transactionExpanedData.deviceChannel }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_ares') }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.ares">
            {{ transactionExpanedData.ares }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_rres') }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.rres">
            {{ transactionExpanedData.rres }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>
      </v-layout>

      <v-layout class="bottom-line mt-10 pb-2" wrap>
        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_userAgent') }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.userAgent">
            {{ transactionExpanedData.userAgent }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_encryptPan') }}
          </v-subheader>
          <div
            class="px-3"
            v-if="transactionExpanedData.enCardNumber"
            style="word-break: break-all;"
          >
            {{ transactionExpanedData.enCardNumber }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub ">
          <v-subheader class="primary--text">
            {{
              $t('page.transaction_records.recordsExtend.th_challengeResult')
            }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.otpResult">
            {{ transactionExpanedData.otpResult }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>

        <v-flex class="sub">
          <v-subheader class="primary--text">
            {{ $t('page.transaction_records.recordsExtend.th_createMillis') }}
          </v-subheader>
          <div class="px-3" v-if="transactionExpanedData.createMillis">
            {{ transactionExpanedData.createMillis }}
          </div>
          <div class="px-3 grey--text" v-else>
            {{ $t('page.transaction_records.recordsExtend.th_none') }}
          </div>
        </v-flex>
      </v-layout>

      <div class="py-2 text-xs-center">
        <v-btn
          outline
          round
          small
          color="primary"
          @click="dialogRecordDetailState = true"
        >
          {{
            $t('page.transaction_records.recordsExtend.btn_transDetail')
          }}</v-btn
        >
      </div>
    </template>
  </div>
</template>
<script>
import DialogRecordDetail from '@/components/transaction/DialogRecordDetail.vue';
import { apiGetTransactionExpandData } from '@/api/apiClient/transaction';

export default {
  components: {
    DialogRecordDetail
  },

  props: {
    errorMessage: String,
    issuerBankId: Number,
    transactionId: Number
  },

  data() {
    return {
      transactionExpanedData: {},
      loading: false,

      dialogRecordDetailState: false,
      dialogRecordLetterState: false
    };
  },

  created() {
    this.getTransactionExpandData();
  },

  methods: {
    async getTransactionExpandData() {
      this.loading = true;
      try {
        const response = await apiGetTransactionExpandData(
          this.issuerBankId,
          this.transactionId
        );
        this.transactionExpanedData = response.data.data;
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sub {
  width: 20%;
  justify-content: stretch;
  word-break: break-word;

  > div {
    width: 100%;
    min-height: 48px;
  }
}

.bottom-line {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.mt-10 {
  margin-top: 10px;
}
</style>
