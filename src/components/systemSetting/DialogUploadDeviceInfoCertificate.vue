<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm(true)"
    :max-width="600"
    :value="dialogDeviceInfoCertificateState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.certificate_deviceInfo.dialog_uploadCertificate.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12 class="mt-2">
          <div
            :class="{
              'error-border': errors.collect('file').length
            }"
            class="file-upload"
          >
            <div class="file-select">
              <div class="file-select-button" id="fileName">
                {{ $t('common.file.label_uploadFile') }}
              </div>
              <div class="file-select-name" id="noFile">
                {{ fileName ? fileName : $t('common.file.noFile') }}
              </div>
              <input
                @change="submitForm(false)"
                ref="deviceInfoCertificate"
                type="file"
                name="file"
                :id="'uploadID'"
                accept=".pem,.cer,.crt,.der,.p7b,.p7c"
                v-validate="'required'"
              />
            </div>
          </div>
          <div class="text-xs-left font-12 pl-2 mt-2 grey--text">
            {{
              $t(
                'page.certificate_deviceInfo.dialog_uploadCertificate.hint_upload'
              )
            }}
          </div>
        </v-flex>
        <v-flex xs12 class="pt-0">
          <div v-if="errors.first('file')" class="font-13 pl-2  error--text">
            {{ $t('common.file.hint_uploadFile') }}
          </div>
        </v-flex>

        <v-flex xs12>
          <v-alert v-if="errorMessage" :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import alertUtil from '@/utils/alertUtil.js';
import { apiUploadDeviceInfoCertificate } from '@/api/apiClient/certificate_deviceInfoCertificate';

export default {
  props: {
    dialogDeviceInfoCertificateState: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      errorMessage: null,
      fileName: null,
      sending: false
    };
  },

  computed: {
    certModify() {
      return getDecryptLocalStorage('permission').certModify;
    }
  },

  created() {
    this.errorMessage = null;
    this.fileName = null;
  },

  methods: {
    async submitForm(isUpload) {
      if (!this.certModify) {
        alertUtil.noPermission();
        return;
      }

      const file = this.$refs.deviceInfoCertificate.files[0];
      this.fileName = file.name;

      if (!isUpload) return;
      this.sending = true;

      try {
        await apiUploadDeviceInfoCertificate(file);
        this.errorMessage = null;
        this.$emit('get-device-info-certificate');
        alertUtil.sendCompleteAlert();
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
        this.fileName = null;
      }
    },

    closeDialog() {
      this.$refs.deviceInfoCertificate.value = '';
      this.errorMessage = null;
      this.$emit('update:dialogDeviceInfoCertificateState', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.error-border {
  border: 2px solid #f95253;
  border-radius: 4px;
}
</style>
