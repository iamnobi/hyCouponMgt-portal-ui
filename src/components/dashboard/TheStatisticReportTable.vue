<template>
  <v-layout v-if="reportData">
    <v-flex class="print-report" xs12 mb-4>
      <v-alert class="mb-2" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>

      <div class="d-flex blue lighten-5 ">
        <h3 class="py-3 pl-4">
          {{ $t('page.dashboard_report.transactionStatic.title') }}
        </h3>
        <div class="text-xs-right py-1">
          <v-btn
            @click="exportAllData"
            :loading="downloading"
            round
            outline
            color="primary"
            class="mb-2"
          >
            <v-icon>get_app</v-icon>
            <span class="vertical-align-text-bottom">
              {{ $t('common.btn.exportOnly') }}
            </span>
          </v-btn>
        </div>
      </div>

      <div class="py-3 px-4">
        {{ $t('page.dashboard_report.transactionStatic.formula_description') }}
        <ul>
          <li>
            {{ $t('page.dashboard_report.transactionStatic.formula1') }}
          </li>
          <li>
            {{ $t('page.dashboard_report.transactionStatic.formula2') }}
          </li>
        </ul>
      </div>

      <v-divider></v-divider>

      <v-data-table
        ref="dTable"
        class="statistic-report-table"
        style="overflow: auto;"
        hide-actions
        :items="reportData"
        :headers-length="8"
        :no-data-text="$t('common.table.noData')"
      >
        <template v-slot:headers>
          <tr>
            <th align="left">
              {{ $t('page.dashboard_report.transactionStatic.th_bank') }}
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{
                    $t('page.dashboard_report.transactionStatic.th_totalQty')
                  }}
                </span>
              </v-flex>
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{ $t('page.dashboard_report.transactionStatic.th_statusY') }}
                </span>
                <base-help-tip
                  :tip-msg="
                    $t('page.dashboard_report.transactionStatic.tip_statusY')
                  "
                ></base-help-tip>
              </v-flex>
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{ $t('page.dashboard_report.transactionStatic.th_statusN') }}
                </span>
                <base-help-tip
                  :tip-msg="
                    $t('page.dashboard_report.transactionStatic.tip_statusN')
                  "
                ></base-help-tip>
              </v-flex>
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{ $t('page.dashboard_report.transactionStatic.th_reject') }}
                </span>
                <base-help-tip
                  :tip-msg="
                    $t('page.dashboard_report.transactionStatic.tip_reject')
                  "
                ></base-help-tip>
              </v-flex>
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{
                    $t('page.dashboard_report.transactionStatic.th_exception')
                  }}
                </span>
                <base-help-tip
                  :tip-msg="
                    $t('page.dashboard_report.transactionStatic.tip_abnormal')
                  "
                ></base-help-tip>
              </v-flex>
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{ $t('page.dashboard_report.transactionStatic.th_uRate') }}
                </span>
              </v-flex>
            </th>
            <th align="right">
              <v-flex x12 d-inline-flex>
                <span class="pr-1">
                  {{ $t('page.dashboard_report.transactionStatic.th_nRate') }}
                </span>
              </v-flex>
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr>
            <td align="left">
              {{ props.item.issuerBankName }}
            </td>
            <td align="right">
              {{ props.item.total | amountAddCommas }}
            </td>
            <td align="right">
              {{ props.item.y | amountAddCommas }}
            </td>
            <td align="right">
              {{ props.item.n | amountAddCommas }}
            </td>
            <td align="right">
              {{ props.item.r | amountAddCommas }}
            </td>
            <td align="right">
              {{ props.item.u | amountAddCommas }}
            </td>
            <td align="right">
              {{ props.item.urate | amountAddCommas }}
            </td>
            <td align="right">
              {{ props.item.nrate | amountAddCommas }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>
</template>

<script>
import { apiExportStatisticReport } from '@/api/apiClient/dashboard';
import { triggerDownload, downloadFileName } from '@/utils/downloadHelper.js';
import { parseDateString } from '@/utils/dateHelper';

export default {
  props: {
    reportData: {
      type: Array
    },

    issuerBankId: {
      type: Number
    },

    selectedTime: {
      type: String
    }
  },

  data() {
    return {
      errorMessage: null,
      downloading: false
    };
  },

  methods: {
    async exportAllData() {
      this.errorMessage = null;
      this.downloading = true;
      const parsedDate = parseDateString(this.selectedTime);
      try {
        let response = await apiExportStatisticReport(
          this.issuerBankId,
          parsedDate.year,
          parsedDate.month,
          parsedDate.day
        );
        if (response) {
          let filename = downloadFileName(response, 'statistic-report');
          triggerDownload(filename, response.data);
        }
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.downloading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.statistic-report-table /deep/ table {
  thead tr th,
  tbody tr td {
    padding: 0 12px;
  }
  thead tr th:first-child,
  tbody tr td:first-child {
    padding-left: 38px;
  }
}
</style>
