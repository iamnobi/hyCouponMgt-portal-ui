<template>
  <v-flex v-if="pageData" xs12>
    <v-card class="pt-2">
      <v-divider></v-divider>

      <v-data-table
        ref="dTable"
        hide-actions
        :items="pageData.data"
        :headers-length="7"
        :no-data-text="$t('common.table.noData')"
        item-key="id"
      >
        <template v-slot:headers>
          <tr>
            <th
              colspan="4"
              class="right-line"
              style="font-size: 14px;background: #F5F5F5;"
            >
              {{ $t('page.transaction_preqRecords.records.th_preq') }}
            </th>
            <th colspan="3" style="font-size: 14px;background: #F5F5F5;">
              {{ $t('page.transaction_preqRecords.records.th_pres') }}
            </th>
          </tr>
          <tr>
            <th class="text-xs-left" style="width: 8%">
              {{ $t('page.transaction_preqRecords.records.th_3dssOperatorId') }}
            </th>
            <th class="text-xs-left" style="width:15%">
              {{
                $t('page.transaction_preqRecords.records.th_3dssEmvRefNumber')
              }}
            </th>
            <th class="text-xs-left" style="width:15%">
              {{ $t('page.transaction_preqRecords.records.th_3dssTransId') }}
            </th>
            <th class="text-xs-left right-line" style="width: 12%">
              {{ $t('page.transaction_preqRecords.records.th_datetime') }}
            </th>
            <th class="text-xs-left" style="width: 15%">
              {{ $t('page.transaction_preqRecords.records.th_dsTransId') }}
            </th>
            <th class="text-xs-left" style="width: 15%">
              {{ $t('page.transaction_preqRecords.records.th_serialNumber') }}
            </th>
            <th class="text-xs-left" style="width: 20%">
              <span class="pr-1">
                {{ $t('page.transaction_preqRecords.records.th_errorMsg') }}
              </span>
              <base-help-tip
                :tip-msg="
                  $t('page.transaction_preqRecords.records.tip_errorMsg')
                "
              ></base-help-tip>
            </th>
          </tr>
        </template>
        <v-divider></v-divider>

        <template v-slot:items="itemProps">
          <tr>
            <td class="word-break-all" style="width: 8%;">
              {{
                itemProps.item.threeDSOperatorId
                  ? itemProps.item.threeDSOperatorId
                  : '-'
              }}
            </td>
            <td class="word-break-all" style="width: 15%">
              {{
                itemProps.item.threeDSServerRefNumber
                  ? itemProps.item.threeDSServerRefNumber
                  : '-'
              }}
            </td>
            <td class="word-break-all" style="width: 15%">
              {{
                itemProps.item.threeDSServerTransId
                  ? itemProps.item.threeDSServerTransId
                  : '-'
              }}
            </td>
            <td class="right-line" style="width: 12%">
              {{ itemProps.item.preqMillis | convertTimeToSecond }}
            </td>
            <td class="word-break-all" style="width: 15%">
              {{ itemProps.item.dsTransId ? itemProps.item.dsTransId : '-' }}
            </td>
            <td class="word-break-all" style="width: 15%">
              <div>
                {{
                  itemProps.item.presSerialNum
                    ? itemProps.item.presSerialNum
                    : '-'
                }}
              </div>
            </td>
            <td class="word-break-all" style="width: 20%">
              {{
                itemProps.item.failureReason
                  ? itemProps.item.failureReason
                  : '-'
              }}
            </td>
          </tr>
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
export default {
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

  computed: {
    currentPage: {
      get() {
        return this.pageData.currentPage;
      },
      set(page) {
        let criteria = Object.assign({}, this.formCriteria);
        criteria.page = page;
        this.$emit('query-transaction', criteria);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.word-break-all {
  word-break: break-all;
}

/deep/ .v-table {
  border-collapse: unset;
  thead tr th,
  tbody tr td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
}

.right-line {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
