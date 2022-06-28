<template>
  <v-flex xs12 mb-4>
    <dialog-add-threeds-Sdk
      :acquirer-bank-modify="acquirerBankModify"
      :dialog-add-threeds-sdk-state.sync="dialogAddThreedsSdkState"
      @get-3ds-sdk="get3DSSdk"
    >
    </dialog-add-threeds-Sdk>

    <v-card>
      <v-layout align-center class="py-2 px-2 white">
        <v-btn
          @click="dialogAddThreedsSdkState = true"
          :disabled="acquirerBankModify === false"
          round
          outline
          color="primary"
          class="mb-2"
        >
          <v-icon class="mr-2">add</v-icon>
          <span class="vertical-align-text-bottom">
            {{ $t('page.acquirer_3dsSdk.btn_createSdk') }}
          </span>
        </v-btn>
      </v-layout>

      <v-divider></v-divider>
      <v-layout>
        <v-flex pl-4 py-3>
          <h3>
            {{ $t('page.acquirer_3dsSdk.sdkList.title') }}
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
            <th align="left" width="90%">
              {{ $t('page.acquirer_3dsSdk.sdkList.th_sdkRefNumber') }}
            </th>
            <th align="center" width="10%">
              {{ $t('page.acquirer_3dsSdk.sdkList.th_delete') }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr>
            <td align="left" width="90%">
              {{ props.item.sdkRefNumber }}
            </td>
            <td width="10%" align="center">
              <base-delete-alert
                :disable-delete-btn="!acquirerBankModify"
                @allow-delete="delete3DSSdk(props.item.id)"
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
import DialogAddThreedsSdk from '@/components/acquirer/DialogAddThreedsSdk.vue';
import alertUtil from '@/utils/alertUtil.js';
import { apiGet3DSSdk, apiDelete3DSSdk } from '@/api/apiClient/acquirer';

export default {
  components: {
    DialogAddThreedsSdk
  },
  props: {
    acquirerBankModify: {
      type: Boolean,
      required: true
    },

    errorMessage: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogAddThreedsSdkState: false,
      pageData: [],
      loading: false
    };
  },
  created() {
    this.get3DSSdk();
  },
  methods: {
    async get3DSSdk() {
      this.loading = true;
      this.$emit('update:errorMessage', null);
      try {
        let response = await apiGet3DSSdk();
        this.pageData = response.data;
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      } finally {
        this.loading = false;
      }
    },

    async delete3DSSdk(id) {
      if (!this.acquirerBankModify) {
        alertUtil.noPermission();
        return;
      }

      this.$emit('update:errorMessage', null);
      try {
        await apiDelete3DSSdk(id);
        this.get3DSSdk();
        alertUtil.sendCompleteAlert();
      } catch (error) {
        this.$emit('update:errorMessage', error.message);
      }
    }
  }
};
</script>
