<template>
  <base-dialog-form
    @close-dialog="$emit('update:dialogAddAcquirerBinState', false)"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogAddAcquirerBinState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.acquirer_acquirerManage.dialog_addAcquirerBin.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-model.trim="acquirerBin"
            :label="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirerBin.label_acquirerBin'
              )
            "
            :data-vv-as="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirerBin.label_acquirerBin'
              )
            "
            name="acquirerBin"
            maxLength="11"
            counter="11"
            v-validate="'required'"
            :error-messages="errors.first('acquirerBin')"
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
import { apiAddAcquirerBin } from '@/api/apiClient/acquirer';

export default {
  props: {
    acquirerBankModify: {
      type: Boolean,
      required: true
    },
    dialogAddAcquirerBinState: {
      type: Boolean,
      default: false
    },
    acquirerId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      acquirerBin: '',
      errorMessage: null,
      sending: false
    };
  },

  watch: {
    dialogAddAcquirerBinState() {
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
      this.errorMessage = null;
      try {
        await apiAddAcquirerBin(this.acquirerId, this.acquirerBin);
        alertUtil.sendCompleteAlert();
        this.$emit('submit-form');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    resetDialog() {
      this.$validator.reset();
      this.acquirerBin = '';
      this.errorMessage = null;
    }
  }
};
</script>
