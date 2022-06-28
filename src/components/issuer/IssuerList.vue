<template>
  <v-flex xs12 mb-4>
    <dialog-add-issuer
      :dialog-add-issuer-state="dialogAddIssuerState"
      :bank-manage-modify="bankManageModify"
      @close-dialog="closeDialog"
      @submit-form="addIssuer"
    >
    </dialog-add-issuer>
    <dialog-edit-issuer
      :edit-data="editData"
      :dialog-edit-issuer-state="dialogEditIssuerState"
      :bank-manage-modify="bankManageModify"
      @close-dialog="closeDialog"
      @submit-form="editIssuer"
    >
    </dialog-edit-issuer>

    <v-card>
      <v-layout align-center class="py-2 px-2 white" v-if="bankManageModify">
        <v-btn
          @click="dialogAddIssuerState = true"
          :disabled="!bankManageModify"
          round
          outline
          color="primary"
          class="mb-2"
        >
          <v-icon class="mr-2">add</v-icon>
          <span class="vertical-align-text-bottom">
            {{ $t('page.issuer_issuerManage.btn_createIssuer') }}
          </span>
        </v-btn>
      </v-layout>

      <v-divider></v-divider>
      <v-layout>
        <v-flex pl-4 py-3>
          <h3>
            {{ $t('page.issuer_issuerManage.issuerList.title') }}
          </h3>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>

      <v-data-table
        class="fixed-table-header"
        hide-actions
        :items="pageData ? pageData.data : []"
        :headers-length="7"
        :no-data-text="$t('common.table.noData')"
        :loading="loading"
        item-key="id"
      >
        <template v-slot:headers>
          <tr>
            <th align="left" width="15%">
              {{ $t('page.issuer_issuerManage.issuerList.th_issuerName') }}
            </th>
            <th align="left" width="15%">
              {{ $t('page.issuer_issuerManage.issuerList.th_issuerCode') }}
            </th>
            <th align="left" width="25%">
              {{
                $t('page.issuer_issuerManage.issuerList.th_issuerAcsRefNumber')
              }}
            </th>
            <th align="left" width="25%">
              {{
                $t('page.issuer_issuerManage.issuerList.th_issuerAcsOperatorId')
              }}
            </th>
            <th align="center" width="10%">
              {{ $t('page.issuer_issuerManage.issuerList.th_issuerEdit') }}
            </th>
            <th align="center" width="10%">
              {{ $t('page.issuer_issuerManage.issuerList.th_issuerDelete') }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr>
            <td align="left" width="15%">
              {{ props.item.name }}
            </td>
            <td align="left" width="15%">
              {{ props.item.code }}
            </td>
            <td align="left" width="25%" style="word-break: break-all;">
              {{ props.item.acsRefNumber }}
            </td>
            <td align="left" width="25%" style="word-break: break-all;">
              {{ props.item.acsOperatorId }}
            </td>
            <td align="center" width="10%">
              <v-btn
                flat
                icon
                color="primary"
                :disabled="!bankManageModify"
                @click="openEditDialog(props.item)"
              >
                <v-icon>
                  create
                </v-icon>
              </v-btn>
            </td>
            <td width="10%" align="center">
              <base-delete-alert
                :disable-delete-btn="!bankManageModify"
                @allow-delete="deleteIssuer(props.item.id)"
              >
              </base-delete-alert>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-divider></v-divider>
    </v-card>
  </v-flex>
</template>

<script>
import DialogAddIssuer from '@/components/issuer/DialogAddIssuer.vue';
import DialogEditIssuer from '@/components/issuer/DialogEditIssuer.vue';
import alertUtil from '@/utils/alertUtil.js';
import { apiDeleteIssuer, apiGetIssuers } from '@/api/apiClient/issuer';
import { GlobalConfig } from '@/config';

export default {
  components: {
    DialogAddIssuer,
    DialogEditIssuer
  },

  props: {
    bankManageModify: {
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
    },

    issuerState: {
      type: Boolean
    },

    code: {
      type: String
    },

    name: {
      type: String
    }
  },

  data() {
    return {
      pageData: {},
      editData: {},
      dialogAddIssuerState: false,
      dialogEditIssuerState: false
    };
  },

  created() {
    this.getIssuerBanks();
  },

  methods: {
    async getIssuerBanks() {
      this.$emit('update:loading', true);

      try {
        const response = await apiGetIssuers();
        this.pageData = {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data.filter(
            item => item.id !== GlobalConfig.MULTIBANKS_ORG_ID
          )
        };

        this.$emit('update:errorMessage', null);
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }

      this.$emit('update:loading', false);
    },

    async deleteIssuer(id) {
      if (!this.bankManageModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        await apiDeleteIssuer(id);
        this.getIssuerBanks();
        alertUtil.sendCompleteAlert();
        this.$emit('update:errorMessage', null);
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }
    },

    openEditDialog(item) {
      this.$emit('update:issuerState', false);
      this.dialogEditIssuerState = true;
      this.editData = item;
    },

    addIssuer() {
      this.closeDialog();
      this.getIssuerBanks();
    },

    editIssuer() {
      this.closeDialog();
      this.getIssuerBanks();
    },

    closeDialog() {
      this.dialogAddIssuerState = false;
      this.dialogEditIssuerState = false;
    }
  }
};
</script>
