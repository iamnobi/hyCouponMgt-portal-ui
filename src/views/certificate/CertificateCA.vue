<template>
  <v-layout wrap>
    <dialog-import-ca-certificate
      :ca-certificate-dialog-state.sync="caCertificateDialogState"
      @submit-form="getCaCertificate()"
    ></dialog-import-ca-certificate>

    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.certificate.sub.ca') }}
        {{ $t('page.certificate_ca.subTitle') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.certificate_ca.description') }}
      </template>
    </base-page-title>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <v-flex xs12 class="text-xs-center mt-3" v-show="loading">
      <base-page-loading class="mb-3"></base-page-loading>
    </v-flex>

    <v-flex xs12 v-if="showSettingArea && loading === false">
      <v-card class="mt-2 pb-4">
        <v-flex xs12 class="py-2 pl-3" v-if="certModify">
          <v-btn
            @click="caCertificateDialogState = true"
            round
            outline
            color="primary"
            class="mb-2"
          >
            <v-icon class="mr-2" style="transform: rotate(180deg)"
              >playlist_add
            </v-icon>
            <span class="vertical-align-text-bottom">
              {{ $t('common.btn.import') }}</span
            >
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>

        <v-flex pl-4 py-3>
          <h3>{{ $t('page.certificate_ca.certificateList.title') }}</h3>
        </v-flex>
        <v-divider></v-divider>

        <v-data-table
          :headers-length="4"
          :no-data-text="$t('common.table.noData')"
          :items="caCertificateData"
          :loading="loading"
          hide-actions
        >
          <template v-slot:headers>
            <tr>
              <th align="left" width="25%">
                {{ $t('page.certificate_ca.certificateList.th_institution') }}
              </th>
              <th align="left" width="25%">
                {{ $t('page.certificate_ca.certificateList.th_expiryDate') }}
              </th>
              <th align="left" width="30%">
                {{ $t('page.certificate_ca.certificateList.th_information') }}
              </th>
              <th align="center" width="10%">
                {{ $t('page.certificate_ca.certificateList.th_delete') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td align="left" width="25%">{{ props.item.issuer }}</td>
              <td align="left" width="25%">
                {{ props.item.expireMillis | convertTimeToSecond }}
              </td>
              <td align="left" width="30%">
                {{ props.item.certificateInformation }}
              </td>
              <td align="center" width="10%">
                <base-delete-alert
                  :disable-delete-btn="!certModify"
                  @allow-delete="deleteCaCertificate(props.item.id)"
                ></base-delete-alert>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-divider></v-divider>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import DialogImportCaCertificate from '@/components/systemSetting/DialogImportCaCertificate.vue';
import alertUtil from '@/utils/alertUtil.js';
import {
  apiDeleteCaCertificate,
  apiGetCaCertificate
} from '@/api/apiClient/certificate_caCertificate';

export default {
  components: {
    DialogImportCaCertificate
  },

  data() {
    return {
      caCertificateDialogState: false,
      caCertificateData: [],

      loading: false,
      errorMessage: null,
      showSettingArea: false
    };
  },

  computed: {
    certModify() {
      return getDecryptLocalStorage('permission').certModify;
    }
  },

  created() {
    this.getCaCertificate();
  },

  methods: {
    async getCaCertificate() {
      this.loading = true;
      this.errorMessage = null;
      try {
        const response = await apiGetCaCertificate();
        const responseData = response.data.data;
        if (responseData.length > 0) {
          this.caCertificateData = responseData;
        }
        this.loading = false;
        this.showSettingArea = true;
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.loading = false;
    },

    async deleteCaCertificate(id) {
      if (!this.certModify) {
        alertUtil.noPermission();
        return;
      }

      await apiDeleteCaCertificate(id);
      alertUtil.sendCompleteAlert();
      this.getCaCertificate();
    }
  }
};
</script>
