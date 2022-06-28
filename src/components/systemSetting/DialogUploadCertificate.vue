<template>
  <base-dialog-form
    ref="sslCertificateForm"
    :value="value"
    @close-dialog="closeDialog"
    @submit-form="submitForm(true)"
    :max-width="$attrs['max-width'] || '750px'"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.certificate_ssl.dialog_uploadCertificate.title') }}
    </template>
    <template slot="dialogContent">
      <v-flex xs12 class="mt-2 mb-4">
        <div
          :class="{
            'error-border': errors.collect('file').length
          }"
          class="file-upload "
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
              ref="sslCertificate"
              type="file"
              name="file"
              accept=".pem,.cer,.crt,.der,.p7b,.p7c"
              :id="'uploadSSLKeyID'"
              v-validate="'required'"
            />
          </div>
        </div>
        <div class="text-xs-left font-12 pl-2 mt-2 grey--text">
          {{ $t('page.certificate_ssl.dialog_uploadCertificate.hint_upload') }}
        </div>
      </v-flex>

      <v-flex xs12>
        <div v-if="errors.first('file')" class="font-13 pl-2 mt-2 error--text">
          {{ $t('common.file.hint_uploadFile') }}
        </div>
      </v-flex>

      <v-flex xs12>
        <v-alert v-if="errorMessage" :value="errorMessage" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-flex>
    </template>
  </base-dialog-form>
</template>

<script>
import {
  apiRenewCertificate,
  apiUploadCertificate
} from '@/api/apiClient/certificate_sslCertificate';

export default {
  inheritAttrs: false,
  props: {
    value: Boolean,
    renewUpload: {
      type: Boolean,
      default: false
    },
    id: Number
  },

  data() {
    return {
      errorMessage: null,
      fileName: null,
      sending: false
    };
  },

  created() {
    this.errorMessage = null;
    this.fileName = null;
  },

  methods: {
    async submitForm(isUpload) {
      const file = this.$refs.sslCertificate.files[0];
      this.fileName = file.name;

      if (!isUpload) return;

      this.sending = true;

      let api = this.renewUpload ? apiRenewCertificate : apiUploadCertificate;

      let data = { file };
      if (this.renewUpload) {
        data['id'] = this.id;
      }

      try {
        await api(data);
        this.$emit('get-ssl-certificate');
        this.errorMessage = null;
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
        this.fileName = null;
      }
    },

    closeDialog() {
      this.$refs.sslCertificateForm.reset();
      this.errorMessage = null;
      this.fileName = null;
      this.$refs.sslCertificate.value = '';
      this.$emit('update:value', false);
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
