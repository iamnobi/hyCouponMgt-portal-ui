<template>
  <base-dialog-form
    ref="formMccUpload"
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    max-width="600px"
    :value="dialogUploadMccListState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.systemSetting_mcc.dialog_importMccList.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <div
            :class="{
              'error-border': errors.collect('file').length
            }"
            class="file-upload"
          >
            <div class="file-select">
              <div class="file-select-button" id="fileName">
                {{ $t('common.file.label_uploadFile') }}
              </div>
              <div class="file-select-name" id="noFile">
                {{ fileName ? fileName : $t('common.file.noFile') }}
              </div>
              <input
                @change="onFileChange($event)"
                ref="inputMccUpload"
                type="file"
                name="file"
                accept=".csv"
                v-validate="'required'"
              />
            </div>
          </div>
          <div class="text-xs-left font-12 pl-2 mt-2 grey--text">
            {{ $t('page.systemSetting_mcc.dialog_importMccList.hint_upload') }}
          </div>
        </v-flex>

        <v-flex xs12>
          <div
            v-if="errors.first('file')"
            class="font-13 pl-2 mt-2 error--text"
          >
            {{ $t('common.file.hint_uploadFile') }}
          </div>
        </v-flex>

        <v-flex xs12 v-if="errorMessage">
          <v-alert :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="grey lighten-5 mt-4 pa-4 ma-0">
        <base-operation-prompt>
          {{ $t('page.systemSetting_mcc.dialog_importMccList.prompt') }}
        </base-operation-prompt>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import { apiUploadMccList } from '@/api/apiClient/systemSetting_mccList';

export default {
  inheritAttrs: false,

  props: {
    mccListModify: {
      type: Boolean,
      required: true
    },
    dialogUploadMccListState: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    dialogUploadMccListState() {
      this.resetDialogForm();
    }
  },

  data() {
    return {
      fileName: null,
      errorMessage: null,
      sending: false
    };
  },

  methods: {
    async submitForm() {
      if (this.$refs.inputMccUpload.files.length === 0) return;

      const file = this.$refs.inputMccUpload.files[0];
      this.sending = true;

      try {
        this.errorMessage = null;
        await apiUploadMccList(file);
        this.$emit('get-mcc-list');
        this.closeDialog();
        this.resetDialogForm();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    onFileChange(event) {
      if (event.target.files.length === 0) {
        this.resetDialogForm();
      } else {
        const file = event.target.files[0];
        this.fileName = file.name;
      }
    },

    closeDialog() {
      this.$emit('update:dialogUploadMccListState', false);
    },

    resetDialogForm() {
      this.$validator.reset();
      this.$refs.formMccUpload.reset();
      this.$refs.inputMccUpload.value = '';
      this.sending = false;
      this.fileName = null;
      this.errorMessage = null;
    }
  }
};
</script>
