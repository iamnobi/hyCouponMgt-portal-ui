<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogMfaState"
  >
    <template slot="dialogTitle">
      {{ $t('page.login.dialog_mfa.title') }}
    </template>
    <template slot="dialogSubTitle">
      {{ $t('page.login.dialog_mfa.description') }}
    </template>
    <template slot="dialogContent">
      <div class="mt-2">
        <v-alert :value="errorMessage" type="error">
          {{ errorMessage }}
        </v-alert>
      </div>

      <v-layout row wrap>
        <v-flex xs9>
          <v-text-field
            v-model.trim="authenticationCode"
            :label="$t('page.login.dialog_mfa.label_authenticationCode')"
            :data-vv-as="$t('page.login.dialog_mfa.label_authenticationCode')"
            persistent-hint
            :hint="$t('page.login.dialog_mfa.hint_authenticationCode')"
            name="authenticationCode"
            v-validate="'required|numeric|max:7'"
            :error-messages="errors.first('authenticationCode')"
            maxLength="7"
            counter="7"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs3 class="text-xs-center pl-0" style="padding-top: 12px;">
          <v-btn @click="sendMfaOtpMail" round outline color="primary">
            {{ $t('page.login.dialog_mfa.btn_resend') }}</v-btn
          >
        </v-flex>
      </v-layout>

      <v-layout row wrap class="grey lighten-5 mt-4 pa-4 ma-0">
        <base-operation-prompt>
          {{ $t('page.login.dialog_mfa.prompt') }}
        </base-operation-prompt>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import { alertSendComplete } from '@/mixins/alertTextCollection';
import { apiSendMfaOtpMail, apiVerificationMfaOtp } from '@/api/apiClient/mfa';

export default {
  mixins: [alertSendComplete],
  props: {
    dialogMfaState: {
      type: Boolean,
      default: false
    },
    issuerBankId: Number,
    account: String
  },

  data() {
    return {
      authenticationCode: null,
      errorMessage: null
    };
  },

  watch: {
    dialogMfaState(val) {
      if (val) {
        this.sendMfaOtpMail();
      }
    }
  },

  methods: {
    async sendMfaOtpMail() {
      this.errorMessage = null;
      let criteria = {
        issuerBankId: this.issuerBankId,
        account: this.account
      };
      try {
        await apiSendMfaOtpMail(criteria);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async submitForm() {
      if (await this.$validator.validateAll()) {
        let criteria = {
          issuerBankId: this.issuerBankId,
          account: this.account,
          authenticationCode: this.authenticationCode
        };
        try {
          await apiVerificationMfaOtp(criteria);
          this.$swal(this.alertSendComplete);
          this.closeDialog();
          this.$emit('submit-form');
        } catch (error) {
          this.errorMessage = error.message;
        }
      }
    },
    closeDialog() {
      this.authenticationCode = null;
      this.errorMessage = null;
      this.$validator.reset();
      this.$emit('update:dialogMfaState', false);
    }
  }
};
</script>
