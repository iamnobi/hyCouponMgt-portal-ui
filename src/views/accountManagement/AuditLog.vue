<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.account.sub.auditLog') }}
      </template>
      ]
      <template slot="pageDescription">
        {{ $t('page.account_auditLog.description') }}
      </template>
    </base-page-title>
    <v-flex xs12 class="mb-4">
      <v-card>
        <v-card-title class="pb-0">
          <base-operation-prompt>{{
            $t('page.account_auditLog.prompt')
          }}</base-operation-prompt> </v-card-title
        ><v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs6>
              <h3 class="mb-2">
                {{ $t('common.query.timeRange.title_timeRange') }}
              </h3>
              <base-vue-ctk-date-time-picker
                :locale="momentLocaleLangName"
                :key="momentLocaleLangName"
                v-model="timeRange"
                :range="true"
                visible
                format="YYYY/MM/DD HH:mm:ss"
                formatted="YYYY/MM/DD"
                :custom-shortcuts="timeRangeShortcuts"
                :label="$t('common.query.timeRange.label_timeRange')"
                id="dateTimePicker-plugin"
                class="dateTimePicker-plugin"
                color="#1C77D2"
              />
            </v-flex>

            <v-flex xs12 class="mt-1">
              <v-expansion-panel v-model="panelIndex" class="elevation-0">
                <v-expansion-panel-content
                  class="transparent"
                  expand-icon="arrow_drop_down"
                >
                  <template v-slot:actions>
                    <v-icon small v-if="panelIndex === 0" color="primary"
                      >unfold_less</v-icon
                    >
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
                      <v-text-field
                        v-model="account"
                        :label="
                          $t('page.account_auditLog.query.label_userAccount')
                        "
                        class="bg-white"
                        outline
                        hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="ip"
                        :label="
                          $t('page.account_auditLog.query.label_ipAddress')
                        "
                        class="bg-white"
                        outline
                        hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-select
                        v-model="status"
                        :label="$t('page.account_auditLog.query.label_status')"
                        :items="operatorStatus"
                        item-text="text"
                        item-value="value"
                        class="bg-white auto-height "
                        outline
                        hide-details
                      ></v-select>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="errorCode"
                        :label="
                          $t('page.account_auditLog.query.label_errorCode')
                        "
                        class="bg-white"
                        hide-details
                        outline
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>

            <v-flex xs12>
              <base-button-group
                @reset-search-criteria="resetSearchCriteria"
                @submit-search="submitSearch"
                :click-search-btn-once="showingTable"
              ></base-button-group>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <the-audit-log-table
      @query-audit-logs="queryAuditLogs"
      v-if="showingTable"
      :pages="pages"
      :page-data="pageData"
      :loading="loading"
    ></the-audit-log-table>
  </v-layout>
</template>

<script>
import moment from 'moment';
import { createNamespacedHelpers } from 'vuex';

import TheAuditLogTable from '@/components/accountManagement/TheAuditLogTable.vue';
import { apiQueryAuditLogs } from '@/api/apiClient/accountManagement';
import { GlobalConfig } from '@/config';

const { mapGetters } = createNamespacedHelpers('i18nStore');

export default {
  components: {
    TheAuditLogTable
  },

  data() {
    return {
      timeRange: {
        start: '',
        end: ''
      },
      account: '',
      ip: '',
      status: '',
      errorCode: '',
      panelIndex: null,
      issuerBankId: GlobalConfig.MULTIBANKS_ORG_ID,

      showingTable: false,

      pageData: [],
      pages: {
        total: 0,
        totalPages: 0,
        currentPage: 1
      },

      errorMessage: null,
      loading: false
    };
  },

  created() {
    this.errorMessage = null;
    let storageCriteria = this.$store.state.storageCriteria;

    if (
      Object.values(storageCriteria).filter(item => item || item === 0).length >
        3 &&
      storageCriteria
    ) {
      let page = 1;
      for (let prop in storageCriteria) {
        if (prop == 'startMillis') {
          this.timeRange.start = storageCriteria[prop]
            ? moment(storageCriteria[prop]).format('YYYY/MM/DD')
            : '';
        } else if (prop == 'endMillis') {
          this.timeRange.end = storageCriteria[prop]
            ? moment(storageCriteria[prop]).format('YYYY/MM/DD')
            : '';
        } else if (prop == 'page') {
          page = storageCriteria[prop];
        } else {
          this[prop] = storageCriteria[prop];
        }
      }
      this.queryAuditLogs(page);
    }
  },

  mounted() {
    this.appendIcon();
  },

  computed: {
    ...mapGetters({
      momentLocaleLangName: 'momentLocaleLangName'
    }),

    timeRangeShortcuts() {
      return [
        {
          label: this.$t('common.query.timeRange.shortcuts_today'),
          value: 'day',
          isSelected: false
        },
        {
          label: this.$t('common.query.timeRange.shortcuts_yesterday'),
          value: '-day',
          isSelected: false
        },
        {
          label: this.$t('common.query.timeRange.shortcuts_thisWeek'),
          value: 'week',
          isSelected: false
        },
        {
          label: this.$t('common.query.timeRange.shortcuts_lastWeek'),
          value: '-week',
          isSelected: false
        },
        {
          label: this.$t('common.query.timeRange.shortcuts_thisMonth'),
          value: 'month',
          isSelected: false
        },
        {
          label: this.$t('common.query.timeRange.shortcuts_lastMonth'),
          value: '-month',
          isSelected: false
        }
      ];
    },

    operatorStatus() {
      return [
        {
          text: this.$t('page.account_auditLog.query.selection_success'),
          value: 'Y'
        },
        {
          text: this.$t('page.account_auditLog.query.selection_fail'),
          value: 'N'
        },
        {
          text: this.$t('page.account_auditLog.query.selection_timeout'),
          value: 'T'
        }
      ];
    }
  },

  methods: {
    async queryAuditLogs(page = 1) {
      this.showingTable = true;
      const criteria = {
        issuerBankId: this.issuerBankId,
        startMillis: moment(this.timeRange.start).valueOf() || '',
        endMillis: moment(this.timeRange.end).valueOf() || '',
        account: this.account,
        ip: this.ip,
        action: this.status,
        errorCode: this.errorCode
      };

      criteria['page'] = page;
      criteria['pageSize'] = 10;

      this.loading = true;
      try {
        let response = await apiQueryAuditLogs(criteria);
        this.pageData = response.data.data;
        this.pages = {
          total: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
        };
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.loading = false;
    },

    submitSearch() {
      this.queryAuditLogs();
    },

    resetSearchCriteria() {
      const criteria = ['account', 'ip', 'status', 'errorCode'];
      for (let prop of criteria) {
        this[prop] = '';
      }
      this.timeRange.start = '';
      this.timeRange.end = '';
      this.showingTable = false;
    },

    // append icon to vue-ctk-date-time-picker
    appendIcon() {
      let dateTimePicker = document.querySelector(
        '.dateTimePicker-plugin .field'
      );

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

.auto-height {
  height: auto;
}

.word-break-all {
  word-break: break-all;
}
</style>
