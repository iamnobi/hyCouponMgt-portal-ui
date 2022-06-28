<template>
  <base-dialog-form
    ref="caCertificateForm"
    :value="caCertificateDialogState"
    @close-dialog="closeDialog"
    @submit-form="submitForm(true)"
    :max-width="$attrs['max-width'] || '750px'"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.certificate_ca.dialog_import.title') }}
    </template>
    <template slot="dialogContent">
      <v-flex xs12 class="mt-2 mb-4 ">
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
              ref="caCertificate"
              type="file"
              name="file"
              :id="'uploadCaCertificateID'"
              accept=".pem,.cer,.crt,.der,.p7b,.p7c"
              v-validate="'required'"
            />
          </div>
        </div>
        <div class="text-xs-left font-12 pl-2 mt-2 grey--text">
          {{ $t('page.certificate_ca.dialog_import.hint_import') }}
        </div>
        <div v-if="errors.first('file')" class="font-13 pl-2 error--text">
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
import alertUtil from '@/utils/alertUtil.js';
import { apiUploadCaCertificate } from '@/api/apiClient/certificate_caCertificate';

export default {
  inheritAttrs: false,
  props: {
    caCertificateDialogState: Boolean
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
      const file = this.$refs.caCertificate.files[0];
      this.fileName = file.name;
      this.errorMessage = null;

      if (!isUpload) return;

      this.sending = true;

      try {
        await apiUploadCaCertificate(file);
        this.$emit('submit-form');
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
      this.errorMessage = null;
      this.fileName = null;
      this.$refs.caCertificate.value = '';
      this.$emit('update:caCertificateDialogState', false);
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
