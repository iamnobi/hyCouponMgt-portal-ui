<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="600"
    :value="dialogBinRangeState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{
        addNewBinRange
          ? $t('page.systemSetting_binRange.dialog_addBinRange.title_add')
          : $t('page.systemSetting_binRange.dialog_addBinRange.title_edit')
      }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12 pb-0>
          <v-text-field
            v-model.trim="startRange"
            :label="
              $t(
                'page.systemSetting_binRange.dialog_addBinRange.label_binRangeStart'
              )
            "
            :data-vv-as="
              $t(
                'page.systemSetting_binRange.dialog_addBinRange.label_binRangeStart'
              )
            "
            :persistent-hint="true"
            :hint="
              $t(
                'page.systemSetting_binRange.dialog_addBinRange.hint_binRangeStart'
              )
            "
            name="binStart"
            v-validate="'numeric|required|max:19|min:13'"
            :error-messages="errors.first('binStart')"
            :browser-autocomplete="'off'"
            maxlength="19"
            counter="19"
            outline
          ></v-text-field>
        </v-flex>
        <v-flex xs12 pb-0>
          <v-text-field
            v-model.trim="endRange"
            :label="
              $t(
                'page.systemSetting_binRange.dialog_addBinRange.label_binRangeEnd'
              )
            "
            :data-vv-as="
              $t(
                'page.systemSetting_binRange.dialog_addBinRange.label_binRangeEnd'
              )
            "
            :persistent-hint="true"
            :hint="
              $t(
                'page.systemSetting_binRange.dialog_addBinRange.hint_binRangeEnd'
              )
            "
            name="binEnd"
            v-validate="'numeric|required|max:19|min:13'"
            :error-messages="errors.first('binEnd')"
            :browser-autocomplete="'off'"
            maxlength="19"
            outline
          ></v-text-field>
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
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import alertUtil from '@/utils/alertUtil.js';

import {
  apiAddBinRange,
  apiUploadBinRange
} from '@/api/apiClient/systemSetting_binRange';

export default {
  props: {
    dialogBinRangeState: {
      type: Boolean,
      default: false
    },

    addNewBinRange: {
      type: Boolean,
      default: true
    },

    issuerBankId: {
      type: Number
    },

    selectedItem: {
      type: Object
    }
  },

  watch: {
    dialogBinRangeState(val) {
      if (val) {
        this.$validator.reset();
        if (this.addNewBinRange) {
          this.startRange = '';
          this.endRange = '';
        } else {
          this.startRange = this.selectedItem.startRange;
          this.endRange = this.selectedItem.endRange;
        }
      }
    }
  },

  data() {
    return {
      startRange: '',
      endRange: '',
      errorMessage: null,
      sending: false
    };
  },

  computed: {
    sysBinRangeModify() {
      return getDecryptLocalStorage('permission').sysBinRangeModify;
    }
  },

  created() {
    this.errorMessage = null;
  },

  methods: {
    async submitForm() {
      if (!this.sysBinRangeModify) {
        alertUtil.noPermission();
        return;
      }

      if (this.startRange > this.endRange) {
        this.errorMessage = this.$t(
          'page.systemSetting_binRange.dialog_addBinRange.warning_startGreaterThanEnd'
        );
        return;
      }

      this.sending = true;

      let criteria = {
        startRange: this.startRange,
        endRange: this.endRange,
        issuerBankId: this.issuerBankId
      };

      try {
        if (this.addNewBinRange) {
          await apiAddBinRange(criteria);
          alertUtil.sendCompleteAlert();
        } else {
          criteria['id'] = this.selectedItem.id;
          await apiUploadBinRange(criteria);
          alertUtil.sendCompleteAlert();
        }
        this.closeDialog();
        this.$emit('submit-form');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    closeDialog() {
      this.errorMessage = null;
      this.$emit('update:dialogBinRangeState', false);
    },

    setBinRange() {}
  }
};
</script>
