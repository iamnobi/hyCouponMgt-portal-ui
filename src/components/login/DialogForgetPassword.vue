<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="550"
    :value="dialogForgetPasswordState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.login.dialog_forgetPassword.title') }}
    </template>
    <template slot="dialogSubTitle">
      {{ $t('page.login.dialog_forgetPassword.description') }}
    </template>
    <template slot="dialogContent">
      <v-layout mx-0 mt-3>
        <v-text-field
          v-model.trim="account"
          :label="$t('page.login.dialog_forgetPassword.label_userAccount')"
          :data-vv-as="$t('page.login.dialog_forgetPassword.label_userAccount')"
          @input="errorMessage = null"
          name="account"
          v-validate="'required'"
          :error-messages="errors.first('account')"
          outline
        ></v-text-field>
      </v-layout>

      <div>
        <v-alert :value="errorMessage" type="error">
          {{ errorMessage }}
        </v-alert>
      </div>

      <v-layout row wrap class="grey lighten-5 mt-2 pa-4 ma-0">
        <base-operation-prompt>
          {{ $t('page.login.dialog_forgetPassword.prompt') }}
        </base-operation-prompt>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import { alertSendComplete } from '@/mixins/alertTextCollection';
import { apiSendChangePasswordMail } from '@/api/apiClient/personalSetting';

export default {
  mixins: [alertSendComplete],
  props: {
    dialogForgetPasswordState: {
      type: Boolean,
      default: false
    },

    isMultipleBank: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      account: null,
      errorMessage: null,
      sending: false
    };
  },

  watch: {
    dialogForgetPasswordState(val) {
      if (val) {
        this.resetDialog();
      }
    }
  },

  methods: {
    async submitForm() {
      if (await this.$validator.validateAll()) {
        this.sending = true;
        this.errorMessage = null;
        try {
          let bankCode = '';
          await apiSendChangePasswordMail(bankCode, this.account);
          this.$swal(this.alertSendComplete);
          this.closeDialog();
        } catch (error) {
          this.errorMessage = error.message;
        } finally {
          this.sending = false;
        }
      }
    },

    closeDialog() {
      this.$emit('update:dialogForgetPasswordState', false);
    },

    resetDialog() {
      this.account = null;
      this.errorMessage = null;
      this.$validator.reset();
    }
  }
};
</script>
