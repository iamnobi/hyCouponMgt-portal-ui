<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="1000"
    :value="dialogAddIssuerState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.issuer_issuerManage.dialog_addIssuer.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
            v-model.trim="bankName"
            :label="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuerName')
            "
            :data-vv-as="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuerName')
            "
            name="bankName"
            v-validate="'required'"
            :error-messages="errors.first('bankName')"
            maxlength="50"
            counter="50"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="bankCode"
            :label="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuerCode')
            "
            :data-vv-as="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuerCode')
            "
            name="bankCode"
            v-validate="'required|alpha_num'"
            :error-messages="errors.first('bankCode')"
            maxlength="11"
            counter="11"
            outline
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
            v-model.trim="threeDSMethodUrl"
            :label="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuer3dsUrl')
            "
            :data-vv-as="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuer3dsUrl')
            "
            name="threeDSMethodUrl"
            maxlength="512"
            counter="512"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="acsUrl"
            :label="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuerAcsUrl')
            "
            :data-vv-as="
              $t('page.issuer_issuerManage.dialog_addIssuer.label_issuerAcsUrl')
            "
            name="acsUrl"
            v-validate="'required'"
            :error-messages="errors.first('acsUrl')"
            maxlength="512"
            counter="512"
            outline
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
            v-model.trim="acsRefNumber"
            :label="
              $t(
                'page.issuer_issuerManage.dialog_addIssuer.label_issuerAcsRefNumber'
              )
            "
            :data-vv-as="
              $t(
                'page.issuer_issuerManage.dialog_addIssuer.label_issuerAcsRefNumber'
              )
            "
            name="acsRefNumber"
            v-validate="'required'"
            :error-messages="errors.first('acsRefNumber')"
            maxlength="32"
            counter="32"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model.trim="acsOperatorId"
            :label="
              $t(
                'page.issuer_issuerManage.dialog_addIssuer.label_issuerAcsOperatorId'
              )
            "
            :data-vv-as="
              $t(
                'page.issuer_issuerManage.dialog_addIssuer.label_issuerAcsOperatorId'
              )
            "
            name="acsOperatorId"
            v-validate="'required'"
            :error-messages="errors.first('acsOperatorId')"
            maxlength="32"
            counter="32"
            outline
          >
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-alert :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import alertUtil from '@/utils/alertUtil.js';
import { apiAddIssuer } from '@/api/apiClient/issuer';

export default {
  props: {
    dialogAddIssuerState: {
      type: Boolean,
      default: false
    },
    bankManageModify: {
      type: Boolean
    }
  },

  data() {
    return {
      bankName: '',
      bankCode: '',
      threeDSMethodUrl: '',
      acsUrl: '',
      acsRefNumber: '',
      errorMessage: null,
      sending: false,
      acsOperatorId: 'ITMX_ACS_'
    };
  },

  watch: {
    dialogAddIssuerState(val) {
      if (val) {
        this.$validator.reset();
        this.bankName = '';
        this.bankCode = '';
        this.threeDSMethodUrl = '';
        this.acsUrl = '';
        this.acsRefNumber = '';
        this.acsOperatorId = 'ITMX_ACS_';
      }
    }
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async submitForm() {
      if (!this.bankManageModify) {
        alertUtil.noPermission();
        return;
      }

      this.sending = true;
      try {
        await apiAddIssuer(
          this.bankName,
          this.bankCode,
          this.threeDSMethodUrl,
          this.acsUrl,
          this.acsRefNumber,
          this.acsOperatorId
        );
        alertUtil.sendCompleteAlert();
        this.errorMessage = null;
        this.$emit('submit-form');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    closeDialog() {
      this.bankName = '';
      this.bankCode = '';
      this.threeDSMethodUrl = '';
      this.acsUrl = '';
      this.acsRefNumber = '';
      this.acsOperatorId = '';
      this.errorMessage = null;
      this.$emit('close-dialog');
    }
  }
};
</script>
