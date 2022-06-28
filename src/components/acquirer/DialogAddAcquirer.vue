<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogAddAcquirerState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.acquirer_acquirerManage.dialog_addAcquirer.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-model.trim="acquirerName"
            :label="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirer.label_acquirerName'
              )
            "
            :data-vv-as="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirer.label_acquirerName'
              )
            "
            name="acquirerName"
            v-validate="'required'"
            :error-messages="errors.first('acquirerName')"
            maxlength="50"
            counter="50"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model.trim="threeDSReferenceNumber"
            :label="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirer.label_acquirer3dsRefNumber'
              )
            "
            :data-vv-as="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirer.label_acquirer3dsRefNumber'
              )
            "
            name="threeDSReferenceNumber"
            v-validate="'required'"
            :error-messages="errors.first('threeDSReferenceNumber')"
            maxlength="32"
            counter="32"
            outline
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model.trim="threeDSOperatorId"
            :label="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirer.label_acquirer3dsOperatorId'
              )
            "
            :data-vv-as="
              $t(
                'page.acquirer_acquirerManage.dialog_addAcquirer.label_acquirer3dsOperatorId'
              )
            "
            name="threeDSOperatorId"
            v-validate="'required'"
            :error-messages="errors.first('threeDSOperatorId')"
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
import { apiAddAcquirer } from '@/api/apiClient/acquirer';

export default {
  props: {
    acquirerBankModify: {
      type: Boolean,
      required: true
    },
    dialogAddAcquirerState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      acquirerName: '',
      threeDSReferenceNumber: '',
      threeDSOperatorId: 'ITMX_3DS_',
      errorMessage: null,
      sending: false
    };
  },
  watch: {
    dialogAddAcquirerState(val) {
      if (val) {
        this.$validator.reset();
        this.acquirerName = '';
        this.threeDSReferenceNumber = '';
        this.threeDSOperatorId = 'ITMX_3DS_';
      }
    }
  },
  created() {
    this.errorMessage = null;
  },
  methods: {
    async submitForm() {
      if (!this.acquirerBankModify) {
        alertUtil.noPermission();
        return;
      }
      this.sending = true;

      try {
        await apiAddAcquirer(
          this.acquirerName,
          this.threeDSReferenceNumber,
          this.threeDSOperatorId
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
      this.acquirerName = '';
      this.threeDSReferenceNumber = '';
      this.threeDSOperatorId = '';
      this.errorMessage = null;
      this.$emit('close-dialog');
    }
  }
};
</script>
