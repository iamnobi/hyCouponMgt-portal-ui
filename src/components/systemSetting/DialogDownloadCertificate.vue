<template>
  <div>
    <base-dialog-form
      v-if="needPassword"
      ref="downloadP7BForm"
      v-bind="$attrs"
      :value="value"
      @close-dialog="closeDialog"
      @submit-form="submitForm"
      :max-width="$attrs['max-width'] || '500px'"
      :sending="sending"
    >
      <template slot="dialogTitle">
        {{ $t('page.certificate_ssl.dialog_downloadCertificate.title') }}
      </template>
      <template slot="dialogContent">
        <v-flex xs12 class="py-0">
          <v-text-field
            v-model.trim="password"
            type="password"
            :label="
              $t(
                'page.certificate_ssl.dialog_downloadCertificate.label_password'
              )
            "
            :data-vv-as="
              $t(
                'page.certificate_ssl.dialog_downloadCertificate.label_password'
              )
            "
            name="P12Password"
            v-validate="this.needPassword ? 'required' : ''"
            :error-messages="errors.first('P12Password')"
            outline
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-alert :value="errors.first('file')" type="error">
            {{ errors.first('file') }}
          </v-alert>
          <v-alert v-if="errorMessage" :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>
      </template>
    </base-dialog-form>
  </div>
</template>

<script>
import { downloadString } from '@/utils/downloadHelper.js';
import { apiDownloadSslCertificate } from '@/api/apiClient/certificate_sslCertificate';

export default {
  inheritAttrs: false,
  props: {
    value: Boolean,
    needPassword: Boolean
  },

  data() {
    return {
      errorMessage: null,
      password: '',
      sending: false
    };
  },

  watch: {
    value(val) {
      if (val && !this.needPassword) {
        this.submitForm();
      }
    }
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async submitForm() {
      this.sending = true;
      this.$emit('is-downloading', true);

      try {
        let response = await apiDownloadSslCertificate(this.password);

        this.downloadCertificate(response.data);
        this.errorMessage = null;
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
      this.$emit('is-downloading', false);
    },

    downloadCertificate(data) {
      const fileName = 'SSL_Client_Certificate.p12';
      downloadString(fileName, data);
    },

    closeDialog() {
      this.errorMessage = null;
      this.$emit('update:value', false);
      this.password = '';
    }
  }
};
</script>
