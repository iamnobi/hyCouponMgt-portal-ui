<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogAddMemberState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.account_groupPermission.dialog_addMemberList.title_add') }}
    </template>
    <template slot="dialogContent">
      <base-operation-prompt>
        {{ $t('page.account_groupPermission.dialog_addMemberList.prompt') }}
      </base-operation-prompt>

      <v-layout row wrap>
        <v-flex xs12 class="mt-2 mb-3">
          <v-text-field
            v-model.trim="userAccount"
            :label="
              $t(
                'page.account_groupPermission.dialog_addMemberList.label_userAccount'
              )
            "
            :data-vv-as="
              $t(
                'page.account_groupPermission.dialog_addMemberList.label_userAccount'
              )
            "
            name="userAccount"
            v-validate="'required'"
            :error-messages="errors.first('userAccount')"
            :maxLength="50"
            :counter="50"
            outline
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-alert class="mt-2" type="error" :value="errorMessage">
        {{ errorMessage }}
      </v-alert>
    </template>
  </base-dialog-form>
</template>

<script>
import alertUtil from '@/utils/alertUtil.js';
import { apiAddCustomGroupMember } from '@/api/apiClient/accountManagement';

export default {
  inheritAttrs: false,

  props: {
    dialogAddMemberState: {
      type: Boolean,
      default: true
    },

    selectGroupId: {
      type: Number
    },

    issuerBankId: {
      type: Number
    }
  },

  data() {
    return {
      errorMessage: null,
      userAccount: '',
      sending: false
    };
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async submitForm() {
      this.sending = true;
      try {
        await apiAddCustomGroupMember(
          this.issuerBankId,
          this.userAccount,
          this.selectGroupId
        );
        alertUtil.sendCompleteAlert();
        this.$emit('get-custom-group-members');
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    closeDialog() {
      this.userAccount = '';
      this.errorMessage = null;
      this.$validator.reset();
      this.$emit('update:dialogAddMemberState', false);
    }
  }
};
</script>
