<template>
  <base-dialog-form
    ref="createInfoForm"
    :value="dialogGenerateCsr"
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="$attrs['max-width'] || '750px'"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.certificate_deviceInfo.dialog_createCsr.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs6 class="pt-0">
          <v-text-field
            v-model.trim="infoForm.country"
            :label="
              $t('page.certificate_deviceInfo.dialog_createCsr.label_country')
            "
            :data-vv-as="
              $t('page.certificate_deviceInfo.dialog_createCsr.label_country')
            "
            :placeholder="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.placeholder_country'
              )
            "
            persistent-hint
            :hint="
              $t('page.certificate_deviceInfo.dialog_createCsr.hint_country')
            "
            name="country"
            v-validate="'required|alpha|length:2'"
            :error-messages="errors.first('country')"
            maxlength="2"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs6 class="pt-0">
          <v-text-field
            v-model.trim="infoForm.organization"
            :label="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_organization'
              )
            "
            :data-vv-as="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_organization'
              )
            "
            :placeholder="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.placeholder_organization'
              )
            "
            name="organization"
            v-validate="'required'"
            :error-messages="errors.first('organization')"
            :maxLength="100"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs6 class="pt-0">
          <v-text-field
            v-model.trim="infoForm.organizationUnit"
            :label="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_organizationUnit'
              )
            "
            :data-vv-as="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_organizationUnit'
              )
            "
            :placeholder="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.placeholder_organizationUnit'
              )
            "
            name="organizationUnit"
            v-validate="'required'"
            :error-messages="errors.first('organizationUnit')"
            maxLength="100"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs6 class="pt-0">
          <v-text-field
            v-model.trim="infoForm.commonName"
            :label="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_commonName'
              )
            "
            :data-vv-as="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_commonName'
              )
            "
            :placeholder="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.placeholder_commonName'
              )
            "
            name="commonName"
            v-validate="'required'"
            :error-messages="errors.first('commonName')"
            maxLength="100"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs6 class="pt-0">
          <v-text-field
            v-model.trim="infoForm.locality"
            :label="
              $t('page.certificate_deviceInfo.dialog_createCsr.label_locality')
            "
            :data-vv-as="
              $t('page.certificate_deviceInfo.dialog_createCsr.label_locality')
            "
            :placeholder="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.placeholder_locality'
              )
            "
            persistent-hint
            :hint="
              $t('page.certificate_deviceInfo.dialog_createCsr.hint_locality')
            "
            name="locality"
            v-validate="'required'"
            :error-messages="errors.first('locality')"
            :maxLength="100"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs6 class="pt-0">
          <v-text-field
            v-model.trim="infoForm.stateOrProvince"
            :label="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_stateOrProvince'
              )
            "
            :data-vv-as="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.label_stateOrProvince'
              )
            "
            :placeholder="
              $t(
                'page.certificate_deviceInfo.dialog_createCsr.placeholder_stateOrProvince'
              )
            "
            name="stateOrProvince"
            v-validate="'required'"
            :error-messages="errors.first('stateOrProvince')"
            maxLength="100"
            outline
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-alert v-if="errorMessage" :value="errorMessage" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-flex>
    </template>
  </base-dialog-form>
</template>

<script>
import { downloadString } from '@/utils/downloadHelper.js';
import { apiCreateDeviceInfoGenKey } from '@/api/apiClient/certificate_deviceInfoCertificate';
import {
  apiCreateRenewSslGenKey,
  apiCreateSslGenKey
} from '@/api/apiClient/certificate_sslCertificate';

const emptyInfoForm = () => ({
  country: '',
  organization: '',
  organizationUnit: '',
  commonName: '',
  locality: '',
  stateOrProvince: ''
});

export default {
  inheritAttrs: false,

  props: {
    dialogGenerateCsr: Boolean,
    type: String,
    clickRenew: Boolean
  },

  data() {
    return {
      errorMessage: null,
      infoForm: emptyInfoForm(),
      sending: false
    };
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async submitForm() {
      this.sending = true;
      this.errorMessage = null;

      try {
        let response;

        if (this.type === 'DeviceInfo') {
          response = await apiCreateDeviceInfoGenKey(
            this.infoForm.commonName,
            this.infoForm.country,
            this.infoForm.locality,
            this.infoForm.organization,
            this.infoForm.organizationUnit,
            this.infoForm.stateOrProvince
          );
        } else {
          const api = this.clickRenew
            ? apiCreateRenewSslGenKey
            : apiCreateSslGenKey;
          response = await api(
            this.infoForm.commonName,
            this.infoForm.country,
            this.infoForm.locality,
            this.infoForm.organization,
            this.infoForm.organizationUnit,
            this.infoForm.stateOrProvince
          );
        }

        this.csrString = response.data.data;
        await this.downloadCsrFile();
        this.$emit('get-ssl-certificate');
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    downloadCsrFile() {
      const fileName = 'client_csr';
      downloadString(fileName, this.csrString);
    },

    closeDialog() {
      this.$refs.createInfoForm.reset();
      this.errorMessage = null;
      this.infoForm = emptyInfoForm();
      this.$emit('update:dialogGenerateCsr', false);
    }
  }
};
</script>
