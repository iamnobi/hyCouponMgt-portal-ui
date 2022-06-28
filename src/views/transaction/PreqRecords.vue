<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.transaction.sub.preqRecords') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.transaction_preqRecords.description') }}
      </template>
    </base-page-title>

    <v-flex xs12 class="mb-3">
      <the-preq-records-criteria
        :showing-table.sync="showingTable"
        :time-range-after.sync="timeRangeAfter"
        :loading="loading"
        @query-transaction="queryTransaction"
        @reset-page="resetPage"
      ></the-preq-records-criteria>
    </v-flex>

    <v-flex class="mb-2">
      <v-alert :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <v-flex v-if="showingTable" class="mb-3">
      <v-card>
        <v-container fluid grid-list-lg>
          <v-layout wrap row>
            <v-flex xs12>
              <div class="grey--text">
                {{ $t('common.table.timeRange.prefix') }}
                <span class="primary--text">
                  {{
                    timeRangeAfter && timeRangeAfter.startTime
                      ? timeRangeAfter.startTime
                      : $t('common.table.timeRange.pastTime')
                  }}
                </span>
                {{ $t('common.table.timeRange.infix') }}
                <span class="primary--text">
                  {{
                    timeRangeAfter && timeRangeAfter.endTime
                      ? timeRangeAfter.endTime
                      : $t('common.table.timeRange.currentTime')
                  }}
                </span>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>

    <the-preq-records-table
      v-if="showingTable"
      :form-criteria="formCriteria"
      :page-data="pageData"
      :loading="loading"
      :errorMessage.sync="errorMessage"
      @query-transaction="queryTransaction"
    ></the-preq-records-table>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import ThePreqRecordsCriteria from '@/components/transaction/ThePreqRecordsCriteria.vue';
import ThePreqRecordsTable from '@/components/transaction/ThePreqRecordsTable.vue';
import { apiQueryPReqRecords } from '@/api/apiClient/transaction';

export default {
  components: {
    ThePreqRecordsCriteria,
    ThePreqRecordsTable
  },

  data() {
    return {
      formCriteria: null,
      timeRangeAfter: null,
      showingTable: false,
      errorMessage: null,
      loading: false,
      pageData: null
    };
  },

  computed: {
    ...mapGetters({
      momentLocaleLangName: 'i18nStore/momentLocaleLangName'
    })
  },

  methods: {
    async queryTransaction(criteria) {
      this.errorMessage = null;
      try {
        this.loading = true;

        const response = await apiQueryPReqRecords(criteria);
        this.pageData = response.data;
        this.formCriteria = criteria;
        this.showingTable = true;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },

    resetPage() {
      this.errorMessage = null;
      this.showingTable = false;
      this.timeRangeAfter = null;
      this.pageData = null;
    }
  }
};
</script>
