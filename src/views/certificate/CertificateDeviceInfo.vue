<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.certificate.sub.deviceInfo') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.certificate_deviceInfo.description') }}
      </template>
    </base-page-title>

    <dialog-upload-device-info-certificate
      @get-device-info-certificate="getDeviceInfoCertificate"
      :dialog-device-info-certificate-state.sync="
        dialogDeviceInfoCertificateState
      "
    ></dialog-upload-device-info-certificate>

    <dialog-create-csr-file
      :max-width="900"
      :type="'DeviceInfo'"
      :dialog-generate-csr.sync="dialogGenerateCsr"
    ></dialog-create-csr-file>

    <dialog-change-device-info-certificate
      @get-device-info-certificate="getDeviceInfoCertificate"
      :dialog-change-device-info-certificate-state.sync="
        dialogChangeDeviceInfoCertificateState
      "
    ></dialog-change-device-info-certificate>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <v-flex xs12 class="text-xs-center mt-3" v-show="loading">
      <base-page-loading class="mb-3"></base-page-loading>
    </v-flex>

    <v-container class="pa-0" v-show="showSettingArea && loading === false">
      <v-card class="mt-2 px-0">
        <v-card-title class="pb-0">
          <v-layout class="width100 mb-2" align-center justify-space-between>
            <h3>
              {{ $t('page.certificate_deviceInfo.setting.title') }}
            </h3>

            <the-certificate-device-info-state :setting-state="settingState">
            </the-certificate-device-info-state>

            <v-spacer></v-spacer>

            <v-btn
              v-if="settingState"
              :disabled="!certModify"
              @click="dialogChangeDeviceInfoCertificateState = true"
              class="mb-2"
              color="primary"
              round
              outline
            >
              <span>{{
                $t('page.certificate_deviceInfo.btn_changeCertificate')
              }}</span>
            </v-btn>
            <v-btn
              round
              outline
              color="primary"
              class="mb-2"
              :disabled="!certModify"
              @click="dialogDeviceInfoCertificateState = true"
            >
              <span>{{
                $t('page.certificate_deviceInfo.btn_uploadCertificate')
              }}</span>
            </v-btn>
            <v-btn
              round
              @click="dialogGenerateCsr = true"
              :disabled="!certModify"
              outline
              color="primary"
              class="mb-2"
            >
              <span>{{ $t('page.certificate_deviceInfo.btn_createCsr') }}</span>
            </v-btn>
          </v-layout>
        </v-card-title>
        <v-layout row wrap class="width100">
          <v-flex xs12 class="py-2 mb-3">
            <v-divider></v-divider>
            <v-data-table
              :headers-length="2"
              :items="deviceInfoItems"
              class="no-hover-effect-table"
              :loading="loading"
              hide-actions
            >
              <template v-slot:headers>
                <tr>
                  <th width="25%" align="left">
                    {{
                      $t(
                        'page.certificate_deviceInfo.setting.th_certificateName'
                      )
                    }}
                  </th>
                  <th width="75%" align="left">
                    {{
                      $t('page.certificate_deviceInfo.setting.th_information')
                    }}
                  </th>
                </tr>
              </template>
              <template slot="items" slot-scope="props">
                <tr>
                  <td width="25%" align="left">
                    <div class="font-16 font-weight600">
                      {{ props.item.name }}
                    </div>
                  </td>
                  <td width="75%" align="left">
                    <the-certificate-device-info-content
                      :certificate-data="
                        certificateData
                          ? certificateData[props.item.value]
                          : null
                      "
                    ></the-certificate-device-info-content>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import TheCertificateDeviceInfoState from '@/components/systemSetting/TheCertificateDeviceInfoState.vue';
import TheCertificateDeviceInfoContent from '@/components/systemSetting/TheCertificateDeviceInfoContent.vue';
import DialogChangeDeviceInfoCertificate from '@/components/systemSetting/DialogChangeDeviceInfoCertificate.vue';
import DialogUploadDeviceInfoCertificate from '@/components/systemSetting/DialogUploadDeviceInfoCertificate.vue';
import DialogCreateCsrFile from '@/components/systemSetting/DialogCreateCsrFile.vue';
import { apiGetDeviceInfoCertificate } from '@/api/apiClient/certificate_deviceInfoCertificate';

export default {
  components: {
    TheCertificateDeviceInfoState,
    TheCertificateDeviceInfoContent,
    DialogChangeDeviceInfoCertificate,
    DialogUploadDeviceInfoCertificate,
    DialogCreateCsrFile
  },

  data() {
    return {
      // for dialog buttons use
      dialogDeviceInfoCertificateState: false,
      dialogChangeDeviceInfoCertificateState: false,
      dialogGenerateCsr: false,

      certificateData: null,

      showTargetArea: false,
      showSettingArea: false,
      errorMessage: null,
      loading: false,
      settingState: false
    };
  },

  computed: {
    certModify() {
      return getDecryptLocalStorage('permission').certModify;
    },

    deviceInfoItems() {
      return [
        {
          name: this.$t('page.certificate_deviceInfo.setting.certificate'),
          value: 'certificate'
        },
        {
          name: this.$t(
            'page.certificate_deviceInfo.setting.rootCaCertificate'
          ),
          value: 'rootCaCertificate'
        },
        {
          name: this.$t('page.certificate_deviceInfo.setting.subCaCertificate'),
          value: 'subCaCertificate'
        }
      ];
    }
  },

  created() {
    this.queryCertificate();
  },

  methods: {
    async getDeviceInfoCertificate() {
      this.certificateData = null;
      this.settingState = false;
      this.errorMessage = null;
      this.loading = true;

      try {
        const response = await apiGetDeviceInfoCertificate();
        this.errorMessage = null;

        const responseData = response.data.data;
        if (Object.keys(responseData).length > 0) {
          this.certificateData = responseData;
          this.settingState = true;
        }
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
        this.showSettingArea = true;
      }
    },

    async queryCertificate() {
      this.getDeviceInfoCertificate();
    }
  }
};
</script>

<style lang="scss" scoped>
.no-hover-effect-table ::v-deep tbody tr:hover:not(.v-datatable__expand-row) {
  background: transparent;
}

/deep/ .v-text-field {
  &.v-input--is-disabled:not(.v-input--is-readonly) {
    pointer-events: auto;
  }

  &.theme--light.v-input--is-disabled input {
    color: #6f6f6f;
  }
}
</style>
