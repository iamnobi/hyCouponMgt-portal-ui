<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm(true)"
    :max-width="800"
    :value="dialogChangeSslCertificateState"
    :disableSubmitButton="!certificateList || certificateList.length === 0"
    :sending="sending"
    :loading="loading"
  >
    <template slot="dialogTitle">
      {{ $t('page.certificate_ssl.dialog_changeCertificate.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12 v-if="certificateList">
          <v-radio-group v-model="selectedItem" class="mt-0">
            <v-radio
              v-for="item in certificateList"
              :key="item.id"
              :value="item.id"
              color="primary"
            >
              <template v-slot:label>
                <v-card
                  :min-width="650"
                  class="card-selection elevation-0 ml-2 pa-2 font-13"
                  :class="{
                    current: item.current,
                    selected: item.id === selectedItem
                  }"
                >
                  <table class="width100">
                    <tbody>
                      <tr>
                        <td class="pa-2 grey--text text--darken-1" width="25%">
                          {{
                            $t(
                              'page.certificate_ssl.dialog_changeCertificate.th_createDate'
                            )
                          }}
                        </td>
                        <td class="pa-2 word-break">
                          {{ item.createMillis | convertTimeToSecond }}
                        </td>
                      </tr>
                      <tr>
                        <td class="pa-2 grey--text text--darken-1" width="25%">
                          {{
                            $t(
                              'page.certificate_ssl.dialog_changeCertificate.th_uploadDate'
                            )
                          }}
                        </td>
                        <td class="pa-2 word-break">
                          {{ item.certUploadedMillis | convertTimeToSecond }}
                        </td>
                      </tr>
                      <tr>
                        <td class="pa-2 grey--text text--darken-1" width="25%">
                          {{
                            $t(
                              'page.certificate_ssl.dialog_changeCertificate.th_expiryDate'
                            )
                          }}
                        </td>
                        <td class="pa-2 word-break">
                          {{ item.certExpireMillis | convertTimeToSecond }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-card>
              </template>
            </v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs12>
          <v-alert v-if="errorMessage" :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import alertUtil from '@/utils/alertUtil.js';
import {
  apiChangeSslCertificate,
  apiGetSslCertificateList
} from '@/api/apiClient/certificate_sslCertificate';

export default {
  props: {
    dialogChangeSslCertificateState: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      certificateList: null,
      selectedItem: '',
      loading: false,
      sending: false,
      errorMessage: null
    };
  },

  watch: {
    dialogChangeSslCertificateState(val) {
      if (val) {
        this.getSslCertificateList();
      }
    }
  },

  methods: {
    async getSslCertificateList() {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await apiGetSslCertificateList();
        this.certificateList = response.data.data;
        let currentCertificate = this.certificateList.find(
          item => item.current === true
        );
        this.selectedItem = currentCertificate ? currentCertificate.id : '';
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.sending = true;
      try {
        await apiChangeSslCertificate(this.selectedItem);
        this.errorMessage = null;
        this.$emit('get-ssl-certificate');
        alertUtil.sendCompleteAlert();
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.sending = false;
      }
    },

    closeDialog() {
      this.errorMessage = null;
      this.$emit('update:dialogChangeSslCertificateState', false);
    }
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #1976d2;
.card-selection {
  border: 1px solid #e0e0e0;
  &.selected {
    border: 1px solid $primary-color;
    background-color: #1976d211;
  }
  &.current {
    background-color: #1976d222;
    color: $primary-color;
    font-weight: bolder;
  }
}
</style>
