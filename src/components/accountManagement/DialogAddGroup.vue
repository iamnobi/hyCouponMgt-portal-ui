<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogAddGroupState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{
        isNewGroupDialog
          ? $t('page.account_groupPermission.dialog_editRoleGroup.title_create')
          : $t('page.account_groupPermission.dialog_editRoleGroup.title_edit')
      }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12 class="mt-2 mb-3">
          <v-text-field
            v-model.trim="groupName"
            :label="
              $t(
                'page.account_groupPermission.dialog_editRoleGroup.label_groupName'
              )
            "
            :data-vv-as="
              $t(
                'page.account_groupPermission.dialog_editRoleGroup.label_groupName'
              )
            "
            name="groupName"
            v-validate="'required|max:30'"
            :error-messages="errors.first('groupName')"
            :maxLength="30"
            :counter="30"
            outline
          ></v-text-field>
        </v-flex>
      </v-layout>

      <div class="mt-2">
        <v-alert :value="errorMessage" type="error">
          {{ errorMessage }}
        </v-alert>
      </div>
    </template>
  </base-dialog-form>
</template>

<script>
import alertUtil from '@/utils/alertUtil.js';
import {
  apiCreateCustomGroup,
  apiUpdateCustomGroup
} from '@/api/apiClient/accountManagement';

export default {
  inheritAttrs: false,

  props: {
    dialogAddGroupState: {
      type: Boolean,
      default: true
    },

    isNewGroupDialog: {
      type: Boolean,
      default: true
    },

    selectGroupId: {
      type: Number
    },

    selectGroupName: {
      type: String
    },

    userGroupModify: {
      type: Boolean
    },

    issuerBankId: {
      type: Number
    }
  },

  data() {
    return {
      errorMessage: null,
      groupName: '',
      sending: false
    };
  },

  watch: {
    dialogAddGroupState(val) {
      if (val && !this.isNewGroupDialog) {
        this.groupName = this.selectGroupName || '';
      }
    }
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async submitForm() {
      if (!this.userGroupModify) {
        alertUtil.noPermission();
        return;
      }

      this.errorMessage = null;
      this.sending = true;
      try {
        if (this.isNewGroupDialog) {
          await apiCreateCustomGroup(this.issuerBankId, this.groupName);
        } else {
          await apiUpdateCustomGroup(
            this.issuerBankId,
            this.selectGroupId,
            this.groupName
          );
        }
        alertUtil.sendCompleteAlert();
        this.$emit('get-group-lists');
        this.closeDialog();
        this.$emit('submit-form');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    closeDialog() {
      this.$emit('update:dialogAddGroupState', false);
      this.groupName = '';
      this.errorMessage = null;
      this.$validator.reset();
    }
  }
};
</script>
