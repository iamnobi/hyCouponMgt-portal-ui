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
          <acquirer-bank-selector
            v-model="threeDSOperatorId"
            :error-message="errorUnselectedBank"
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

        <v-flex xs12 class="mt-3">
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
import moment from 'moment';
import { mapGetters } from 'vuex';
import AcquirerBankSelector from '@/components/common/AcquirerBankSelector.vue';

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
      threeDSOperatorId: null,
      errorUnselectedBank: null,
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
      isEndDatetimeOutOfRange: false
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
    threeDSOperatorId() {
      this.errorUnselectedBank = null;
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
      if (this.threeDSOperatorId === null) {
        this.errorUnselectedBank = this.$t(
          'common.query.acquirerBank.hint_selectOneBank'
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

      let criteria = {
        page: 1,
        pageSize: 10,
        timeZone: this.timeZone,
        threeDSOperatorId: this.threeDSOperatorId,
        startMillis: this.startMillis,
        endMillis: this.endMillis
      };

      this.$emit('query-transaction', criteria);
    },

    resetSearchCriteria() {
      this.threeDSOperatorId = null;
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
      this.$emit('reset-page');
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
</style>
