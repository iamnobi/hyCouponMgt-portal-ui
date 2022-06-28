<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="1000"
    :value="dialogEditIssuerState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.issuer_issuerManage.dialog_editIssuer.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
            v-model.trim="bankName"
            :label="
              $t('page.issuer_issuerManage.dialog_editIssuer.label_issuerName')
            "
            :data-vv-as="
              $t('page.issuer_issuerManage.dialog_editIssuer.label_issuerName')
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
              $t('page.issuer_issuerManage.dialog_editIssuer.label_issuerCode')
            "
            :data-vv-as="
              $t('page.issuer_issuerManage.dialog_editIssuer.label_issuerCode')
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
              $t(
                'page.issuer_issuerManage.dialog_editIssuer.label_issuer3dsUrl'
              )
            "
            :data-vv-as="
              $t(
                'page.issuer_issuerManage.dialog_editIssuer.label_issuer3dsUrl'
              )
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
              $t(
                'page.issuer_issuerManage.dialog_editIssuer.label_issuerAcsUrl'
              )
            "
            :data-vv-as="
              $t(
                'page.issuer_issuerManage.dialog_editIssuer.label_issuerAcsUrl'
              )
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
                'page.issuer_issuerManage.dialog_editIssuer.label_issuerAcsRefNumber'
              )
            "
            :data-vv-as="
              $t(
                'page.issuer_issuerManage.dialog_editIssuer.label_issuerAcsRefNumber'
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
            v-model="acsOperatorId"
            :label="
              $t(
                'page.issuer_issuerManage.dialog_editIssuer.label_issuerAcsOperatorId'
              )
            "
            outline
            disabled
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
import { apiUpdateIssuer } from '@/api/apiClient/issuer';

export default {
  props: {
    dialogEditIssuerState: {
      type: Boolean,
      default: false
    },
    bankManageModify: {
      type: Boolean
    },
    editData: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          code: '',
          threeDSMethodUrl: '',
          acsUrl: '',
          acsRefNumber: '',
          acsOperatorId: ''
        };
      }
    }
  },

  data() {
    return {
      bankId: 0,
      bankName: '',
      bankCode: '',
      threeDSMethodUrl: '',
      acsUrl: '',
      acsRefNumber: '',
      acsOperatorId: '',
      errorMessage: null,
      sending: false
    };
  },
  watch: {
    dialogEditIssuerState(val) {
      if (val) {
        this.$validator.reset();
        this.bankId = this.editData.id;
        this.bankName = this.editData.name;
        this.bankCode = this.editData.code;
        this.threeDSMethodUrl = this.editData.threeDSMethodUrl;
        this.acsUrl = this.editData.acsUrl;
        this.acsRefNumber = this.editData.acsRefNumber;
        this.acsOperatorId = this.editData.acsOperatorId;
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
        await apiUpdateIssuer(
          this.bankId,
          this.bankName,
          this.bankCode,
          this.threeDSMethodUrl,
          this.acsUrl,
          this.acsRefNumber
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
