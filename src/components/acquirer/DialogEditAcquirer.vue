<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogEditAcquirerState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.acquirer_acquirerManage.dialog_editAcquirer.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-model.trim="acquirerName"
            :label="
              $t(
                'page.acquirer_acquirerManage.dialog_editAcquirer.label_acquirerName'
              )
            "
            :data-vv-as="
              $t(
                'page.acquirer_acquirerManage.dialog_editAcquirer.label_acquirerName'
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
                'page.acquirer_acquirerManage.dialog_editAcquirer.label_acquirer3dsRefNumber'
              )
            "
            :data-vv-as="
              $t(
                'page.acquirer_acquirerManage.dialog_editAcquirer.label_acquirer3dsRefNumber'
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
            v-model="threeDSOperatorId"
            :label="
              $t(
                'page.acquirer_acquirerManage.dialog_editAcquirer.label_acquirer3dsOperatorId'
              )
            "
            outline
            disabled
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
import { apiEditAcquirer } from '@/api/apiClient/acquirer';

export default {
  props: {
    acquirerBankModify: {
      type: Boolean,
      required: true
    },
    dialogEditAcquirerState: {
      type: Boolean,
      default: false
    },
    editedData: {
      type: Object,
      default: () => {
        return {
          id: 0,
          name: '',
          threeDSServerRefNumber: ''
        };
      }
    }
  },
  data() {
    return {
      acquirerId: 0,
      acquirerName: '',
      threeDSReferenceNumber: '',
      threeDSOperatorId: '',
      errorMessage: null,
      sending: false
    };
  },
  watch: {
    dialogEditAcquirerState(val) {
      if (val) {
        this.$validator.reset();
        this.acquirerId = this.editedData.id;
        this.acquirerName = this.editedData.name;
        this.threeDSReferenceNumber = this.editedData.threeDSServerRefNumber;
        this.threeDSOperatorId = this.editedData.threeDSOperatorId;
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
        await apiEditAcquirer(
          this.acquirerId,
          this.acquirerName,
          this.threeDSReferenceNumber
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
      this.acquirerId = 0;
      this.acquirerName = '';
      this.threeDSReferenceNumber = '';
      this.threeDSOperatorId = '';
      this.errorMessage = null;
      this.$emit('close-dialog');
    }
  }
};
</script>
