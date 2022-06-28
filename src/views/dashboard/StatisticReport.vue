<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.dashboard.title') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.dashboard_report.description') }}
      </template>
    </base-page-title>

    <v-flex xs12 class="mb-4 query-card">
      <v-card>
        <v-card-title class="pb-0 pl-4 pt-4">
          <base-operation-prompt
            >{{ $t('page.dashboard_report.prompt') }}
          </base-operation-prompt>
        </v-card-title>
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs6 class="pb-0 mb-0 mouth-select-box">
              <v-layout class=" mb-2" wrap row align-center>
                <h3 class="pl-2 mt-1 mr-3">
                  {{ $t('page.dashboard_report.query.title_timeRange') }}
                </h3>
                <v-radio-group
                  hide-details
                  v-model="rangeChoose"
                  row
                  class="mt-1 pt-0"
                >
                  <v-radio
                    color="primary"
                    :label="this.$t('page.dashboard_report.query.radio_daily')"
                    value="rangeDay"
                  ></v-radio>
                  <v-radio
                    color="primary"
                    :label="
                      this.$t('page.dashboard_report.query.radio_monthly')
                    "
                    value="rangeMonth"
                  ></v-radio>
                </v-radio-group>
              </v-layout>
              <!-- Day Pick -->
              <base-vue-ctk-date-time-picker
                :locale="momentLocaleLangName"
                :key="momentLocaleLangName"
                :error="alertSelectTime"
                class="pan-dateTimePicker-plugin"
                v-model="pickerTime"
                :label="
                  this.$t('page.dashboard_report.query.label_timeRange_daily')
                "
                :format="'YYYY-MM-DD'"
                :formatted="'YYYY-MM-DD'"
                :maxDate="maxDayDate"
                :no-header="false"
                :only-date="true"
                :no-label="true"
                :no-button-now="true"
                id="dateTimePicker-plugin"
                color="#1C77D2"
                ref="dateTimePicker"
                v-show="rangeChoose === 'rangeDay'"
              />
              <!-- Month Pick -->
              <v-menu
                ref="dateTimeMonthPicker"
                :close-on-click="false"
                :close-on-content-click="false"
                :nudge-left="20"
                :return-value.sync="pickerMonthTime"
                lazy
                transition="slide-y-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
                v-if="rangeChoose !== 'rangeDay'"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="pickerMonthTime"
                    v-model="pickerMonthTime"
                    :error="alertSelectTime"
                    :label="
                      $t('page.dashboard_report.query.label_timeRange_monthly')
                    "
                    append-icon="date_range"
                    outline
                    hide-details
                    readonly
                    v-on="on"
                  >
                    <v-icon slot="append" color="primary">
                      date_range
                    </v-icon>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="pickerMonthTime"
                  type="month"
                  :max="maxMonthDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    outline
                    color="primary"
                    @click="$refs.dateTimeMonthPicker.save(pickerMonthTime)"
                    >{{ $t('common.btn.save') }}</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <div
                v-if="alertSelectTime"
                class="error--text  ml-2 font-12 mt-2"
              >
                {{ $t('page.dashboard_report.query.hint_timeRange') }}
              </div>
            </v-flex>

            <v-flex xs12 pt-2>
              <v-alert :value="errorMessage" type="error">
                {{ errorMessage }}
              </v-alert>
            </v-flex>
            <v-flex xs12>
              <base-button-group
                @reset-search-criteria="resetSearchCriteria"
                @submit-search="queryStatisticReport"
                :click-search-btn-once="shwoCancelBtn"
              ></base-button-group>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <v-flex xs12 v-if="showingTable">
      <v-card style="width:100%">
        <v-layout>
          <v-flex mt-4 mb-4 pl-4>
            <h3 class="mt-1 mb-2">
              <template v-if="rangeChoose === 'rangeDay'">
                <span class="grey--text">
                  {{ $t('page.dashboard_report.daily') }}
                </span>
                <span class="blue--text">{{ pickerTime }}</span>
              </template>
              <template v-else>
                <span class="grey--text">
                  {{ $t('page.dashboard_report.monthly') }}
                </span>
                <span class="blue--text">{{ pickerMonthTime }}</span>
              </template>
            </h3>
          </v-flex>
        </v-layout>
        <!-- 各交易狀態統計數值報表 -->
        <the-statistic-report-table
          class="mb-2"
          :report-data="reportData"
          :issuer-bank-id="issuerBankId"
          :selected-time="pickerTime || pickerMonthTime || ''"
        />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import { parseDateString } from '@/utils/dateHelper';
import { apiQueryStatisticReport } from '@/api/apiClient/dashboard';
import TheStatisticReportTable from '@/components/dashboard/TheStatisticReportTable.vue';

const { mapGetters } = createNamespacedHelpers('i18nStore');

export default {
  components: {
    TheStatisticReportTable
  },

  data() {
    return {
      // 時間範圍
      issuerBankId: null,
      pickerTime: '',
      pickerMonthTime: null,
      rangeChoose: 'rangeDay',
      maxDayDate: moment()
        .subtract(1, 'd')
        .format('YYYY-MM-DD'),

      // 報表 data
      reportData: [],
      manualAuthReport: [],
      statisticReason: [],

      // ----- 展示報表
      showingTable: false,
      shwoCancelBtn: false,
      alertSelectTime: false,

      // alert
      errorMessage: null
    };
  },

  watch: {
    pickerTime(val) {
      if (val) {
        this.alertSelectTime = false;
        this.showingTable = false;
      }
    },

    pickerMonthTime(val) {
      if (val) {
        this.alertSelectTime = false;
        this.showingTable = false;
      }
    },

    rangeChoose() {
      this.alertSelectTime = false;
      this.resetSearchCriteria();
    }
  },

  created() {
    this.setInitialIssuerBankId();
    this.resetSearchCriteria();
  },

  computed: {
    ...mapGetters(['momentLocaleLangName']),

    maxMonthDate() {
      let year = new Date().getFullYear(),
        month = new Date().getMonth(),
        date = `${year}-${month}`;
      return date;
    }
  },

  mounted() {
    this.appendIcon();
  },

  methods: {
    setInitialIssuerBankId() {
      this.issuerBankId = getDecryptLocalStorage('issuerBankId');
    },

    // ----- append icon to vue-ctk-date-time-picker
    appendIcon() {
      let dateTimePicker = document.querySelector(
        '.pan-dateTimePicker-plugin .field'
      );
      dateTimePicker.children[0].style.borderWidth = '2px';

      // 如果已有icon 不需要再重新加入
      let nodes = [...dateTimePicker.childNodes];

      let checkIcon = nodes.find(item => {
        return item.nodeName === 'I';
      });
      if (checkIcon) return;

      let icon = document.createElement('i');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute(
        'class',
        'v-icon material-icons theme--light append-icon primary--text'
      );

      icon.textContent = 'date_range';
      dateTimePicker.appendChild(icon);
    },

    resetSearchCriteria() {
      this.shwoCancelBtn = false;
      this.alertSelectTime = false;
      this.pickerTime = '';
      this.pickerMonthTime = '';
      this.errorMessage = null;
      this.showingTable = false;
    },

    // check is selected bank and select time
    checkAllFieldIsFilled() {
      if (!this.pickerTime && !this.pickerMonthTime) {
        this.alertSelectTime = true;
        return false;
      }

      const selectedTime = this.pickerTime || this.pickerMonthTime || '';
      return selectedTime;
    },

    async queryStatisticReport() {
      this.shwoCancelBtn = true;
      let selectedTime = this.checkAllFieldIsFilled();
      if (!selectedTime) return;
      const parsedDate = parseDateString(selectedTime);
      this.alertSelectTime = false;
      this.errorMessage = null;
      try {
        //  報表查詢 - 交易狀態統計報表
        let transactionStatus = await apiQueryStatisticReport(
          this.issuerBankId,
          parsedDate.year,
          parsedDate.month,
          parsedDate.day
        );
        this.reportData = transactionStatus.data.data;

        this.showingTable = true;
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mouth-select-box {
  /deep/ .v-input input {
    margin-top: 0 !important;
    max-height: none; // for ie
    max-height: initial !important;
  }
  /deep/ .v-input--is-label-active input {
    padding-top: 24px !important;
    padding-bottom: 2px;
  }
}

// 時間管理
/deep/ .append-icon {
  position: absolute;
  padding-left: 5px;
  padding-top: 2px;
  padding-right: 15px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  &:before {
    content: '';
    left: -10px;
    top: -13px;
    bottom: -15px;
    width: 1px;
    height: 52px;
    position: absolute;
    background: #ccc;
  }
}

// month
.v-input {
  /deep/ .v-input__slot {
    .v-text-field__slot {
      position: absolute;
      z-index: 10;
      width: 100%;
      left: 0;
      bottom: 0;
      top: 0;
      padding-left: 10px;
    }
    .v-input__append-inner {
      margin-top: 15px;
      margin-right: 1px;
      padding-left: 14px;
    }
    label,
    input {
      font-size: 14px;
      line-height: 18px;
    }
  }

  /deep/ &.pickerMonthTime {
    &.theme--light.v-text-field--outline:not(.v-input--is-focused):not(.v-input--has-state)
      .v-input__control
      > .v-input__slot:hover {
      border-color: rgba(0, 0, 0, 0.87) !important;
    }
    &.v-input--is-focused .v-input__control > .v-input__slot {
      border-color: #1976d2 !important;
    }
    label {
      left: 10px !important;
    }
    input {
      padding-top: 24px;
    }

    .v-icon {
      color: #1c76d2 !important;
      position: relative;
      cursor: pointer;
      &:before {
        content: '';
        left: -15px;
        top: -15px;
        bottom: -14px;
        width: 1px;
        height: 52px;
        position: absolute;
        background: #ccc;
      }
    }
  }
}

.v-menu__content /deep/ {
  z-index: 25 !important;
}
</style>
