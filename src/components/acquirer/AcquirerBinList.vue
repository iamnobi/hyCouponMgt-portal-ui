<template>
  <v-flex xs12 mb-4>
    <dialog-add-acquirer-bin
      :acquirer-bank-modify="acquirerBankModify"
      :dialog-add-acquirer-bin-state.sync="dialogAddAcquirerBinState"
      :acquirer-id="selectedAcquirerId"
      @close-dialog="dialogAddAcquirerBinState = false"
      @submit-form="addAcquirerBin"
    >
    </dialog-add-acquirer-bin>

    <v-card>
      <v-layout align-center class="py-2 px-2 white">
        <v-btn
          @click="dialogAddAcquirerBinState = true"
          :disabled="acquirerBankModify === false"
          round
          outline
          color="primary"
          class="mb-2"
        >
          <v-icon class="mr-2">add</v-icon>
          <span class="vertical-align-text-bottom">
            {{ $t('page.acquirer_acquirerManage.btn_addAcquirerBin') }}
          </span>
        </v-btn>
      </v-layout>

      <v-divider></v-divider>
      <v-layout>
        <v-flex pl-4 py-3>
          <h3>
            {{
              $t('page.acquirer_acquirerManage.acquirerBinList.title', {
                acquirer: selectedAcquirerName
              })
            }}
          </h3>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>

      <v-data-table
        class="fixed-table-header"
        hide-actions
        :items="pageData ? pageData.data : []"
        :headers-length="3"
        :no-data-text="$t('common.table.noData')"
        :loading="loading"
        item-key="id"
      >
        <template v-slot:headers>
          <tr>
            <th align="left" width="90%">
              {{
                $t(
                  'page.acquirer_acquirerManage.acquirerBinList.th_acquirerBin'
                )
              }}
            </th>
            <th align="center" width="10%">
              {{
                $t(
                  'page.acquirer_acquirerManage.acquirerBinList.th_acquirerBinDelete'
                )
              }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr>
            <td align="left" width="90%">
              {{ props.item.acquirerBin }}
            </td>
            <td align="center" width="10%">
              <base-delete-alert
                :disable-delete-btn="acquirerBankModify === false"
                @allow-delete="deleteAcquirerBin(props.item.id)"
              >
              </base-delete-alert>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script>
import DialogAddAcquirerBin from '@/components/acquirer/DialogAddAcquirerBin.vue';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiDeleteAcquirerBin,
  apiGetAcquirerBins
} from '@/api/apiClient/acquirer';

export default {
  components: {
    DialogAddAcquirerBin
  },

  props: {
    acquirerBankModify: {
      type: Boolean,
      required: true
    },
    selectedAcquirerId: {
      type: Number,
      required: true
    },
    selectedAcquirerName: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogAddAcquirerBinState: false,
      pageData: []
    };
  },
  watch: {
    selectedAcquirerId() {
      this.getAcquirerBins();
    }
  },
  created() {
    this.errorMessage = null;
    this.getAcquirerBins();
  },
  methods: {
    async getAcquirerBins() {
      this.$emit('update:loading', true);

      try {
        let response = await apiGetAcquirerBins(this.selectedAcquirerId);
        this.pageData = response.data;

        this.$emit('update:errorMessage', null);
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }

      this.$emit('update:loading', false);
    },
    async deleteAcquirerBin(id) {
      if (!this.acquirerBankModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        await apiDeleteAcquirerBin(id);
        this.getAcquirerBins();
        alertUtil.sendCompleteAlert();
        this.$emit('update:errorMessage', null);
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }
    },

    addAcquirerBin() {
      this.closeDialog();
      this.getAcquirerBins();
    },

    closeDialog() {
      this.dialogAddAcquirerBinState = false;
    }
  }
};
</script>
