<template>
  <v-card>
    <v-card-title class="pb-0">
      <base-operation-prompt>{{
        $t('page.transaction_records.prompt')
      }}</base-operation-prompt>
    </v-card-title>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6>
          <base-banks-list
            :issuer-bank-id.sync="issuerBankId"
            :error-message="errorUnselectedBank"
            :show-all-banks="true"
          ></base-banks-list>
        </v-flex>
        <v-flex xs6>
          <acquirer-bank-selector
            v-model="threeDSOperatorId"
          ></acquirer-bank-selector>
        </v-flex>
        <v-flex xs12 pb-0 mt-2>
          <h3 class="mb-0">
            {{ $t('page.transaction_records.query.title_timeRange') }}
          </h3>
        </v-flex>
        <v-flex xs6>
          <base-vue-ctk-date-time-picker
            :locale="momentLocaleLangName"
            :key="momentLocaleLangName"
            v-model="startTime"
            visible
            format="YYYY-MM-DD HH:mm:00"
            :max-date="endTime"
            :min-date="minDate"
            :no-button-now="true"
            formatted="YYYY-MM-DD HH:mm"
            :label="$t('page.transaction_records.query.label_startDatetime')"
            id="dateTimePicker-plugin"
            class="dateTimePicker-start"
            color="#1C77D2"
            @formatted-value="onCtkDatePickerFormatted($event, 'start')"
          />
        </v-flex>
        <v-flex xs6>
          <base-vue-ctk-date-time-picker
            :locale="momentLocaleLangName"
            :key="momentLocaleLangName"
            v-model="endTime"
            :min-date="minTimeEndTime"
            visible
            :no-button-now="true"
            format="YYYY-MM-DD HH:mm:59"
            formatted="YYYY-MM-DD HH:mm"
            :label="$t('page.transaction_records.query.label_endDatetime')"
            class="dateTimePicker-end"
            id="dateTimePicker-plugin"
            color="#1C77D2"
            :error="isEndDatetimeOutOfRange"
            @formatted-value="onCtkDatePickerFormatted($event, 'end')"
          />
          <div
            class="error--text mt-2"
            style="padding: 0 12px; font-size: 12px; line-height: normal"
            v-if="isEndDatetimeOutOfRange"
          >
            {{ $t('common.query.timeRange.hint_endOutOfRange') }}
          </div>
        </v-flex>

        <v-flex xs6 mt-3>
          <v-layout wrap row align-center>
            <h3 class="pl-2 mr-2">
              {{ $t('page.transaction_records.query.title_pan') }}
            </h3>
            <v-flex xs12 class="py-2">
              <v-text-field
                :label="$t('page.transaction_records.query.label_pan')"
                :browser-autocomplete="'off'"
                v-model="pan"
                v-validate="'numeric'"
                :data-vv-as="$t('page.transaction_records.query.label_pan')"
                maxlength="19"
                counter="19"
                name="pan_field"
                key="pan_field"
                :error-messages="errors.first('pan_field')"
                outline
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 class="mt-3">
          <v-expansion-panel v-model="panelIndex" class="elevation-0">
            <v-expansion-panel-content
              class="transparent"
              expand-icon="arrow_drop_down"
            >
              <template v-slot:actions>
                <v-icon small v-if="panelIndex === 0" color="primary">
                  unfold_less
                </v-icon>
                <v-icon v-else small color="primary">unfold_more</v-icon>
              </template>
              <template v-slot:header>
                <span class="primary--text font-15" v-if="panelIndex === 0">
                  {{ $t('common.query.advanceSearch_hide') }}
                </span>
                <span class="primary--text font-15" v-else>
                  {{ $t('common.query.advanceSearch_show') }}
                </span>
              </template>
              <v-layout row wrap class="grey lighten-5 pa-3 mt-0">
                <v-flex xs6>
                  <v-select
                    :items="['Y', 'A', 'C', 'N', 'R', 'U']"
                    :label="$t('page.transaction_records.query.label_ares')"
                    v-model="ares"
                    item-value="value"
                    item-text="text"
                    clearable
                    outline
                    hide-details
                    class="bg-white"
                  ></v-select>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    :items="['Y', 'N']"
                    :label="$t('page.transaction_records.query.label_rres')"
                    v-model="rres"
                    item-value="value"
                    item-text="text"
                    clearable
                    outline
                    hide-details
                    class="bg-white"
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <base-operation-prompt>
                    {{ $t('page.transaction_records.query.caption') }}
                  </base-operation-prompt>
                </v-flex>

                <v-flex xs6>
                  <v-text-field
                    :label="
                      $t(
                        'page.transaction_records.query.label_3dsServerTransID'
                      )
                    "
                    hide-details
                    maxlength="60"
                    v-model="threeDSServerTransID"
                    outline
                    class="bg-white"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    :label="
                      $t('page.transaction_records.query.label_acsTransID')
                    "
                    hide-details
                    maxlength="60"
                    v-model="acsTransID"
                    outline
                    class="bg-white"
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    :label="
                      $t('page.transaction_records.query.label_dsTransID')
                    "
                    maxlength="160"
                    v-model="dsTransID"
                    hide-details
                    outline
                    class="bg-white"
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    :label="
                      $t('page.transaction_records.query.label_sdkTransID')
                    "
                    maxlength="60"
                    v-model="sdkTransID"
                    hide-details
                    outline
                    class="bg-white"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-flex xs12>
          <base-button-group
            :show-submit-btn="errors.items.length > 0 ? false : true"
            :click-search-btn-once="showingTable"
            :loading="loading"
            @reset-search-criteria="resetSearchCriteria"
            @submit-search="submitSearch"
          ></base-button-group>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import AcquirerBankSelector from '@/components/common/AcquirerBankSelector2.vue';

export default {
  components: {
    AcquirerBankSelector
  },
  props: {
    timeRangeAfter: {
      type: Object
    },

    showingTable: {
      type: Boolean
    },

    loading: {
      type: Boolean
    }
  },

  data() {
    return {
      issuerBankId: 0,
      threeDSOperatorId: '0',
      errorUnselectedBank: null,
      pan: '',
      ares: '',
      rres: '',
      threeDSServerTransID: '',
      acsTransID: '',
      dsTransID: '',
      sdkTransID: '',
      startMillis: moment()
        .hour(0)
        .minute(0)
        .second(0)
        .valueOf(),
      endMillis: moment()
        .hour(23)
        .minute(59)
        .second(59)
        .valueOf(),
      minDate: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      isEndDatetimeOutOfRange: false,

      panelIndex: null
    };
  },

  computed: {
    ...mapGetters({
      momentLocaleLangName: 'i18nStore/momentLocaleLangName'
    }),

    timeZone() {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },

    // 時間範圍 - 起始時間
    startTime: {
      get() {
        return moment(this.startMillis).format('YYYY-MM-DD HH:mm');
      },
      set(val) {
        if (val) {
          this.startMillis = moment(val).valueOf();
        }
      }
    },

    // 時間範圍 - 結束時間
    endTime: {
      get() {
        return moment(this.endMillis).format('YYYY-MM-DD HH:mm');
      },
      set(val) {
        if (val) {
          this.endMillis = moment(val).valueOf();
        }
      }
    },

    minTimeEndTime() {
      return moment(this.startTime)
        .subtract(1, 'days')
        .format('YYYY-MM-DD HH:mm');
    }
  },

  watch: {
    issuerBankId() {
      this.errorUnselectedBank = null;
    },

    panelIndex(val) {
      if (val === null) {
        this.ares = '';
        this.rres = '';
        this.threeDSServerTransID = '';
        this.acsTransID = '';
        this.dsTransID = '';
        this.sdkTransID = '';
      }
    }
  },

  updated() {
    // 日期下拉選單新增icon
    this.appendIcon('dateTimePicker-start');
    this.appendIcon('dateTimePicker-end');
  },

  mounted() {
    this.appendIcon('dateTimePicker-start');
    this.appendIcon('dateTimePicker-end');
  },

  methods: {
    submitSearch() {
      if (this.issuerBankId === null) {
        this.errorUnselectedBank = this.$t(
          'common.query.bank.hint_selectOneBank'
        );
        return;
      }

      if (this.endMillis < this.startMillis) {
        this.isEndDatetimeOutOfRange = true;
        return;
      } else {
        this.isEndDatetimeOutOfRange = false;
      }

      this.$emit('update:timeRangeAfter', {
        startTime: this.startTime,
        endTime: this.endTime
      });

      let criteria = this.getQueryModel();
      this.$emit('query-transaction', criteria);
    },

    resetSearchCriteria() {
      this.issuerBankId = 0;
      this.threeDSOperatorId = '0';
      this.pan = '';
      this.startMillis = moment()
        .hour(0)
        .minute(0)
        .second(0)
        .valueOf();
      this.endMillis = moment()
        .hour(23)
        .minute(59)
        .second(59)
        .valueOf();
      this.panelIndex = null;
      this.$emit('reset-page');
    },

    getQueryModel() {
      let page = 1;
      let pageSize = 10;
      let isGeneralQuery =
        this.threeDSServerTransID === '' &&
        this.acsTransID === '' &&
        this.dsTransID === '' &&
        this.sdkTransID === '';

      if (isGeneralQuery) {
        return {
          page: page,
          pageSize: pageSize,
          timeZone: this.timeZone,
          issuerBankId: this.issuerBankId,
          threeDSOperatorId: this.threeDSOperatorId,
          startMillis: this.startMillis,
          endMillis: this.endMillis,
          pan: this.pan,
          ares: this.ares,
          rres: this.rres
        };
      } else {
        // NOTE: 使用 TransID 查詢時，保留畫面查詢條件，但僅帶入 TransID 參數做查找
        return {
          page: page,
          pageSize: pageSize,
          timeZone: this.timeZone,
          issuerBankId: 0,
          threeDSServerTransID: this.threeDSServerTransID,
          threeDSOperatorId: '0',
          acsTransID: this.acsTransID,
          dsTransID: this.dsTransID,
          sdkTransID: this.sdkTransID
        };
      }
    },

    // ! This triggers too many times due to DOM updates, sigh...
    // TODO: ctk-date-picker must have to be removed
    onCtkDatePickerFormatted(event, type) {
      if (type === 'start') {
        this.startTime = event;
      } else if (type === 'end') {
        this.endTime = event;
      }
    },

    // append icon to vue-ctk-date-time-picker
    appendIcon(name) {
      let dateTimePicker = document.querySelector(`.${name} .field`);

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
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .append-icon {
  position: absolute;
  padding-left: 5px;
  padding-right: 15px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
}

/deep/ .append-icon:before {
  content: '';
  left: -10px;
  top: -15px;
  bottom: -15px;
  width: 1px;
  position: absolute;
  background: #ccc;
}

/deep/ .v-expansion-panel__header {
  justify-content: flex-end;
  padding-right: 0;
  > span {
    flex: 0 0 auto;
  }
}
.bg-white {
  background: #fff;
}
</style>
