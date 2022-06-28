<template>
  <v-flex xs12 mb-4>
    <dialog-add-acquirer
      :acquirer-bank-modify="acquirerBankModify"
      :dialog-add-acquirer-state="dialogAddAcquirerState"
      @close-dialog="closeDialog"
      @submit-form="addAcquirer"
    >
    </dialog-add-acquirer>
    <dialog-edit-acquirer
      :edited-data="editData"
      :acquirer-bank-modify="acquirerBankModify"
      :dialog-edit-acquirer-state="dialogEditAcquirerState"
      @close-dialog="closeDialog"
      @submit-form="editAcquirer"
    >
    </dialog-edit-acquirer>

    <v-card>
      <v-layout align-center class="py-2 px-2 white" v-if="acquirerBankModify">
        <v-btn
          @click="dialogAddAcquirerState = true"
          :disabled="!acquirerBankModify"
          round
          outline
          color="primary"
          class="mb-2"
        >
          <v-icon class="mr-2">add</v-icon>
          <span class="vertical-align-text-bottom">
            {{ $t('page.acquirer_acquirerManage.btn_createAcquirer') }}
          </span>
        </v-btn>
      </v-layout>

      <v-divider></v-divider>
      <v-layout>
        <v-flex pl-4 py-3>
          <h3>
            {{ $t('page.acquirer_acquirerManage.acquirerList.title') }}
          </h3>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>

      <v-data-table
        class="fixed-table-header"
        hide-actions
        :items="pageData ? pageData.data : []"
        :headers-length="5"
        :no-data-text="$t('common.table.noData')"
        :loading="loading"
        item-key="id"
      >
        <template v-slot:headers>
          <tr>
            <th align="left" width="15%">
              {{
                $t('page.acquirer_acquirerManage.acquirerList.th_acquirerName')
              }}
            </th>
            <th align="left" width="25%">
              {{
                $t(
                  'page.acquirer_acquirerManage.acquirerList.th_acquirer3dsRefNumber'
                )
              }}
            </th>
            <th align="left" width="25%">
              {{
                $t(
                  'page.acquirer_acquirerManage.acquirerList.th_acquirer3dsOperatorID'
                )
              }}
            </th>
            <th align="center" width="15%">
              {{
                $t('page.acquirer_acquirerManage.acquirerList.th_acquirerBins')
              }}
            </th>
            <th align="center" width="10%">
              {{
                $t('page.acquirer_acquirerManage.acquirerList.th_acquirerEdit')
              }}
            </th>
            <th align="center" width="10%">
              {{
                $t(
                  'page.acquirer_acquirerManage.acquirerList.th_acquirerDelete'
                )
              }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr>
            <td align="left" width="15%">
              {{ props.item.name }}
            </td>
            <td align="left" width="25%">
              {{ props.item.threeDSServerRefNumber }}
            </td>
            <td align="left" width="25%">
              {{ props.item.threeDSOperatorId }}
            </td>
            <td width="15%" align="center">
              <v-btn icon @click="showAcquirerBinArea(props.item)">
                <v-icon color="primary">settings</v-icon>
              </v-btn>
            </td>
            <td width="10%" align="center">
              <v-btn
                flat
                icon
                color="primary"
                :disabled="!acquirerBankModify"
                @click="openEditDialog(props.item)"
              >
                <v-icon>
                  create
                </v-icon>
              </v-btn>
            </td>
            <td width="10%" align="center">
              <base-delete-alert
                :disable-delete-btn="!acquirerBankModify"
                @allow-delete="deleteAcquirer(props.item.id)"
              >
              </base-delete-alert>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- TODO: add paging -->
    </v-card>
  </v-flex>
</template>

<script>
import DialogAddAcquirer from '@/components/acquirer/DialogAddAcquirer.vue';
import DialogEditAcquirer from '@/components/acquirer/DialogEditAcquirer.vue';
import alertUtil from '@/utils/alertUtil.js';
import { apiDeleteAcquirer, apiGetAcquirers } from '@/api/apiClient/acquirer';

export default {
  components: {
    DialogAddAcquirer,
    DialogEditAcquirer
  },
  props: {
    acquirerBankModify: {
      type: Boolean,
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
      dialogAddAcquirerState: false,
      dialogEditAcquirerState: false,
      pageData: [],
      editData: {}
    };
  },
  created() {
    this.getAcquirers();
  },
  methods: {
    async getAcquirers() {
      this.$emit('update:loading', true);

      try {
        let response = await apiGetAcquirers();
        this.pageData = response.data;

        this.$emit('update:errorMessage', null);
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }

      this.$emit('update:loading', false);
    },
    async deleteAcquirer(id) {
      if (!this.acquirerBankModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        await apiDeleteAcquirer(id);
        this.getAcquirers();
        alertUtil.sendCompleteAlert();
        this.$emit('onAcquirerChange');
        this.$emit('update:errorMessage', null);
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }
    },
    openEditDialog(item) {
      this.dialogEditAcquirerState = true;
      this.editData = item;
    },
    showAcquirerBinArea(item) {
      this.$emit('set-selected-acquirer', item);
    },
    addAcquirer() {
      this.closeDialog();
      this.getAcquirers();
      this.$emit('onAcquirerChange');
    },
    editAcquirer() {
      this.closeDialog();
      this.getAcquirers();
      this.$emit('onAcquirerChange');
    },
    closeDialog() {
      this.dialogAddAcquirerState = false;
      this.dialogEditAcquirerState = false;
    }
  }
};
</script>

<style lang="sass" scoped></style>
