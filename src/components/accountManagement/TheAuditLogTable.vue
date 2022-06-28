<template>
  <v-flex class="table-width-expand" xs12>
    <v-alert class="mb-3" :value="errorMessage" type="error">
      {{ errorMessage }}
    </v-alert>
    <v-card>
      <v-layout align-center class="py-4 px-2 white">
        <base-sum-select-amount
          :total="Object.keys(pages).length ? pages.total : 0"
        ></base-sum-select-amount>
      </v-layout>

      <v-divider></v-divider>

      <v-data-table
        ref="dTable"
        class="fixed-table-header"
        hide-actions
        :items="pageData ? pageData : []"
        :headers-length="7"
        :no-data-text="$t('common.table.noData')"
        :loading="$attrs.loading"
        item-key="id"
      >
        <template v-slot:headers="props">
          <tr :class="props.thead">
            <th style="width: 13%" class="text-xs-left">
              {{ $t('page.account_auditLog.auditLog.th_userAccount') }}
            </th>
            <th style="width: 15%" class="text-xs-left">
              {{ $t('page.account_auditLog.auditLog.th_ipAddress') }}
            </th>
            <th style="width: 20%" class="text-xs-left">
              {{ $t('page.account_auditLog.auditLog.th_datetime') }}
            </th>
            <th style="width: 30%;" class="text-xs-left">
              {{ $t('page.account_auditLog.auditLog.th_action') }}
            </th>
            <th style="width: 9%" class="text-xs-left">
              {{ $t('page.account_auditLog.auditLog.th_status') }}
            </th>
            <th style="width: 8%" class="text-xs-center">
              {{ $t('page.account_auditLog.auditLog.th_errorCode') }}
            </th>
            <th style="width: 5%" class="text-xs-left"></th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr>
            <td
              class="cursor-pointer word-break-all"
              style="width: 13%"
              @click="props.expanded = !props.expanded"
            >
              {{ props.item.account }}
            </td>
            <td
              class="cursor-pointer word-break-all"
              style="width: 15%"
              @click="props.expanded = !props.expanded"
            >
              {{ props.item.ip }}
            </td>
            <td
              class="cursor-pointer word-break-all"
              style="width: 20%"
              @click="props.expanded = !props.expanded"
            >
              {{ props.item.createMillis | convertTimeToSecond }}
            </td>
            <td
              class="text-xs-left cursor-pointer word-break-all"
              style="width: 30%; "
              @click="props.expanded = !props.expanded"
            >
              {{ props.item.methodName }}
            </td>

            <td
              class="text-xs-left cursor-pointer word-break-all"
              style="width: 9%"
              @click="props.expanded = !props.expanded"
            >
              {{ operatorStatus(props.item.action) }}
            </td>
            <td
              class="text-xs-center cursor-pointer "
              style="width: 8%"
              @click="props.expanded = !props.expanded"
            >
              {{ props.item.errorCode }}
            </td>
            <td
              style="width: 5%;"
              class=" text-xs-right cursor-pointer show-more"
              @click="props.expanded = !props.expanded"
            >
              <v-icon :color="props.expanded ? 'primary' : ''" small
                >more_horiz
              </v-icon>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <the-audit-log-table-expand
            :expaned-data="props.item.value ? props.item.value : ''"
          />
        </template>
      </v-data-table>

      <v-divider></v-divider>
      <div class="text-xs-center py-3" v-if="pageData">
        <v-pagination
          circle
          total-visible="10"
          v-model="currentPage"
          :length="pages.totalPages"
        >
        </v-pagination>
      </div>
    </v-card>
  </v-flex>
</template>

<script>
import TheAuditLogTableExpand from '@/components/accountManagement/TheAuditLogTableExpand.vue';

export default {
  inheritAttrs: false,

  props: {
    pageData: {
      type: Array
    },

    pages: {
      type: Object
    }
  },

  components: {
    TheAuditLogTableExpand
  },

  data() {
    return {
      loading: false,
      errorMessage: null
    };
  },

  computed: {
    currentPage: {
      get() {
        return this.pages.currentPage;
      },
      set(page) {
        this.$emit('query-audit-logs', page);
      }
    }
  },

  methods: {
    operatorStatus(value) {
      switch (value) {
        case 'Y': {
          return this.$t('page.account_auditLog.auditLog.td_success');
        }
        case 'N': {
          return this.$t('page.account_auditLog.auditLog.td_fail');
        }
        case 'T': {
          return this.$t('page.account_auditLog.auditLog.td_timeout');
        }
        default: {
          return value;
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .fixed-table-header .show-more {
  padding-left: 10px;
  padding-right: 10px;
}

.word-break-all {
  word-break: break-all;
}
</style>
