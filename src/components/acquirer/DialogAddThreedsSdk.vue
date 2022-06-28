<template>
  <base-dialog-form
    @close-dialog="$emit('update:dialogAddThreedsSdkState', false)"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogAddThreedsSdkState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.acquirer_3dsSdk.dialog_add3dsSdk.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-model.trim="sdkRefNumber"
            :label="
              $t('page.acquirer_3dsSdk.dialog_add3dsSdk.label_sdkRefNumber')
            "
            :data-vv-as="
              $t('page.acquirer_3dsSdk.dialog_add3dsSdk.label_sdkRefNumber')
            "
            name="sdkRefNumber"
            v-validate="'required'"
            :error-messages="errors.first('sdkRefNumber')"
            maxlength="32"
            counter="32"
            outline
          >
          </v-text-field>
        </v-flex>
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
import { apiAdd3DSSdk } from '@/api/apiClient/acquirer';

export default {
  props: {
    acquirerBankModify: {
      type: Boolean,
      required: true
    },
    dialogAddThreedsSdkState: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      sdkRefNumber: '',
      errorMessage: null,
      sending: false
    };
  },

  watch: {
    dialogAddThreedsSdkState() {
      this.resetDialog();
    }
  },

  methods: {
    async submitForm() {
      if (!this.acquirerBankModify) {
        alertUtil.noPermission();
        return;
      }

      this.sending = true;
      try {
        await apiAdd3DSSdk(this.sdkRefNumber);
        alertUtil.sendCompleteAlert();
        this.errorMessage = null;
        this.$emit('update:dialogAddThreedsSdkState', false);
        this.$emit('get-3ds-sdk');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    resetDialog() {
      this.$validator.reset();
      this.sdkRefNumber = '';
      this.errorMessage = null;
    }
  }
};
</script>
