<template>
  <v-layout wrap>
    <dialog-create-csr-file
      :max-width="900"
      :dialog-generate-csr.sync="dialogGenerateCsr"
      :click-renew="isClickRenew"
      :type="'SSL'"
      @get-ssl-certificate="getSSLCertificate"
    ></dialog-create-csr-file>

    <dialog-upload-certificate
      :id="certificateData.id"
      :value.sync="dialogUploadCertificate"
      :renew-upload="isRenewUpload"
      @get-ssl-certificate="getSSLCertificate"
    >
    </dialog-upload-certificate>

    <dialog-download-certificate
      :value.sync="dialogDownloadState"
      :need-password="isDownloadNeedPassword"
      @is-downloading="isDownloading"
    >
    </dialog-download-certificate>

    <dialog-change-ssl-certificate
      @get-ssl-certificate="getSSLCertificate"
      :dialog-change-ssl-certificate-state.sync="
        dialogChangeSslCertificateState
      "
    ></dialog-change-ssl-certificate>

    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.certificate.sub.ssl') }}
        {{ $t('page.certificate_ssl.subTitle') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.certificate_ssl.description') }}
        &emsp;
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
      <v-card class="mt-2">
        <v-card-title class="pb-0">
          <v-layout class="py-2 width100" align-center>
            <base-operation-prompt>
              {{ $t('page.certificate_ssl.prompt') }}
            </base-operation-prompt>
          </v-layout>
          <v-layout
            class="width100 height-50 "
            align-center
            justify-space-between
          >
            <h3>{{ $t('page.certificate_ssl.setting.title') }}</h3>

            <the-certificate-ssl-state :certificate-state="certificateState">
            </the-certificate-ssl-state>

            <v-spacer></v-spacer>

            <template v-if="certModify">
              <v-btn
                v-if="certificateState !== 'unset'"
                @click="dialogChangeSslCertificateState = true"
                class="mb-2"
                color="primary"
                round
                outline
              >
                <span>{{
                  $t('page.certificate_ssl.btn_changeCertificate')
                }}</span>
              </v-btn>
              <v-btn
                v-if="certificateState !== 'unset'"
                @click="dialogDownloadState = true"
                :loading="downloading"
                round
                outline
                color="primary"
                class="mb-2"
              >
                <v-icon>get_app</v-icon>
                <span>{{ $t('common.btn.download') }}</span>
              </v-btn>
            </template>
          </v-layout>
        </v-card-title>
        <v-container fluid grid-list-lg>
          <v-layout row wrap class="width100">
            <v-flex xs12> <v-divider></v-divider> </v-flex>
            <v-flex xs12 class="py-0">
              <v-alert class="mb-0" :value="errorMessage" type="error">
                {{ errorMessage }}
              </v-alert>
            </v-flex>
            <v-flex xs12>
              <the-certificate-ssl-content
                :certificate-data="certificateData"
              ></the-certificate-ssl-content>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

      <template v-if="certModify">
        <v-card class="mt-4 pt-1 pb-2" v-show="certificateState === 'unset'">
          <v-card-title class="pb-0">
            <v-layout row wrap>
              <v-flex xs12>
                <h2 class="d-flex mb-2">
                  {{ $t('page.certificate_ssl.createCertificate.title') }}
                </h2>
                <span class="grey--text">
                  {{ $t('page.certificate_ssl.createCertificate.description') }}
                </span>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-container fluid grid-list-lg>
            <v-layout row wrap justify-space-between>
              <div class="optionBox py-4">
                <div class="py-2">
                  {{
                    $t('page.certificate_ssl.createCertificate.title_generate')
                  }}
                </div>
                <v-btn
                  round
                  @click="controlDialogCreateSSLKey(true)"
                  :disabled="certificateState !== 'unset' || downloadSSLKey"
                  outline
                  color="primary"
                  class="mb-2"
                >
                  {{
                    $t('page.certificate_ssl.createCertificate.btn_generate')
                  }}
                </v-btn>

                <base-delete-alert
                  v-if="downloadSSLKey"
                  :icon="false"
                  :small="false"
                  @allow-delete="deleteGenKey"
                >
                  {{ $t('page.certificate_ssl.createCertificate.btn_delete') }}
                </base-delete-alert>
              </div>
            </v-layout>

            <v-layout v-if="downloadSSLKey" row wrap class="mt-4">
              <v-flex xs12 class="yellow lighten-5 px-3 py-4">
                <div class="text-xs-center">
                  <h3 class="pb-2">
                    {{
                      $t(
                        'page.certificate_ssl.createCertificate.title_uploadCertificate'
                      )
                    }}
                  </h3>
                  <v-btn
                    round
                    @click="controlDialogUploadCertificate(true)"
                    color="primary"
                    class="mb-1"
                  >
                    {{
                      $t(
                        'page.certificate_ssl.createCertificate.btn_uploadCertificate'
                      )
                    }}
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-card class="mt-4 pt-1 pb-2" v-show="certificateState !== 'unset'">
          <v-card-title class="pb-0">
            <v-layout row wrap>
              <v-flex xs12>
                <h2 class="d-flex  mb-1">
                  {{ $t('page.certificate_ssl.updateCertificate.title') }}
                </h2>

                <span class="grey--text">
                  {{ $t('page.certificate_ssl.updateCertificate.description') }}
                </span>
              </v-flex>
            </v-layout>
          </v-card-title>

          <v-container fluid grid-list-lg>
            <v-layout row wrap justify-space-between>
              <div class="optionBox py-4">
                <div class=" py-2">
                  {{
                    $t(
                      'page.certificate_ssl.updateCertificate.title_generateCSR'
                    )
                  }}
                </div>
                <v-btn
                  round
                  @click="controlDialogCreateSSLKey(true, true)"
                  :disabled="
                    certificateState === 'unset' ||
                      certificateState === 'renew' ||
                      downloadSSLKey
                  "
                  outline
                  color="primary"
                  class="mb-2"
                >
                  {{
                    $t('page.certificate_ssl.updateCertificate.btn_generateCSR')
                  }}
                </v-btn>
              </div>
            </v-layout>

            <v-layout v-if="downloadSSLKey" row wrap class="mt-4">
              <v-flex xs12 class="yellow lighten-5 px-3 py-4">
                <div class="text-xs-center">
                  <h3 class="pb-2">
                    {{
                      $t(
                        'page.certificate_ssl.updateCertificate.title_uploadCertificate'
                      )
                    }}
                  </h3>
                  <v-btn
                    round
                    @click="controlDialogUploadCertificate(true, true)"
                    color="primary"
                    class="mb-1"
                  >
                    {{
                      $t(
                        'page.certificate_ssl.updateCertificate.btn_uploadCertificate'
                      )
                    }}
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import alertUtil from '@/utils/alertUtil.js';
import DialogCreateCsrFile from '@/components/systemSetting/DialogCreateCsrFile.vue';
import DialogUploadCertificate from '@/components/systemSetting/DialogUploadCertificate.vue';
import DialogDownloadCertificate from '@/components/systemSetting/DialogDownloadCertificate.vue';
import DialogChangeSslCertificate from '@/components/systemSetting/DialogChangeSslCertificate.vue';
import TheCertificateSslState from '@/components/systemSetting/TheCertificateSslState.vue';
import TheCertificateSslContent from '@/components/systemSetting/TheCertificateSslContent.vue';
import { alertSendComplete } from '@/mixins/alertTextCollection';
import {
  apiDeleteGenKey,
  apiGetSSLCertificate
} from '@/api/apiClient/certificate_sslCertificate';

const emptyCertificateData = function() {
  return {
    certificateInformation: '',
    hasTempKey: false,
    isExpire: false,
    renewStatus: 'NONE',
    issuer: ''
  };
};

export default {
  mixins: [alertSendComplete],

  components: {
    DialogDownloadCertificate,
    DialogUploadCertificate,
    DialogCreateCsrFile,
    DialogChangeSslCertificate,
    TheCertificateSslContent,
    TheCertificateSslState
  },

  data() {
    return {
      certificateState: 'unset',

      isDownloadNeedPassword: false,

      certificateData: emptyCertificateData(),
      downloadSSLKey: false,

      loading: false,
      showSettingArea: false,

      dialogGenerateCsr: false,
      isClickRenew: false,

      dialogDownloadState: false,
      downloading: false,

      dialogUploadCertificate: false,
      isRenewUpload: false,

      dialogChangeSslCertificateState: false,

      errorMessage: null
    };
  },

  computed: {
    certModify() {
      return getDecryptLocalStorage('permission').certModify;
    }
  },

  watch: {
    'certificateData.hasTempKey'() {
      this.controlDownloadSSLKey();
    }
  },

  created() {
    this.getSSLCertificate();
  },

  methods: {
    async getSSLCertificate() {
      this.loading = true;
      try {
        let response = await apiGetSSLCertificate();

        if (!response.data.data) {
          this.certificateData = emptyCertificateData();
          this.certificateState = 'unset';
        } else {
          this.certificateData = response.data.data;

          const isExpire = response.data.data.isExpire;
          const renewStatus = response.data.data.renewStatus;

          if (isExpire && renewStatus === 'NONE') {
            this.certificateState = 'expire';
          } else if (renewStatus === 'NONE') {
            this.certificateState = 'unset';
          } else if (renewStatus === 'INIT') {
            this.certificateState = 'success';
          } else if (renewStatus === 'PROCESSING') {
            this.certificateState = 'renew';
          }
        }
        this.errorMessage = null;
        this.loading = false;
        this.showSettingArea = true;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async deleteGenKey() {
      if (!this.certModify) {
        alertUtil.noPermission();
        return;
      }

      try {
        await apiDeleteGenKey();
        this.getSSLCertificate();
        this.$swal(this.alertSendComplete);
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    controlDialogCreateSSLKey(state, isClickRenew = false) {
      this.isClickRenew = isClickRenew;
      this.dialogGenerateCsr = state;
    },

    controlDialogUploadCertificate(state, isRenewUpload = false) {
      this.isRenewUpload = isRenewUpload;
      this.dialogUploadCertificate = state;
    },

    controlDownloadSSLKey() {
      this.downloadSSLKey = this.certificateData.hasTempKey;
    },

    isDownloading(state) {
      this.downloading = state;
    }
  }
};
</script>

<style lang="scss" scoped>
.optionBox {
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  text-align: center;
  width: 100%;
}

.height-50 {
  min-height: 50px;
}
</style>
