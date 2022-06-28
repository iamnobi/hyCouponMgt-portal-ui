<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.systemSetting.sub.general') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.systemSetting_general.description') }}
      </template>
    </base-page-title>

    <v-flex xs12 class="mb-4">
      <v-card :class="{ 'pt-4': !generalSettingModify }">
        <v-card-title class="pb-0" v-if="generalSettingModify">
          <v-layout class="width100" align-center justify-space-between>
            <div>
              <base-operation-prompt>
                {{
                  $t('page.systemSetting_general.prompt')
                }}</base-operation-prompt
              >
            </div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="editable"
              @click="cancelSavingGeneralSettings"
              :disabled="sending"
              round
              color="primary"
              outline
              class="mb-2"
            >
              {{ $t('common.btn.cancel') }}
            </v-btn>
            <v-btn
              v-if="editable"
              @click="saveGeneralSettings"
              :loading="sending"
              round
              color="primary"
              class="mb-2"
            >
              <span> {{ $t('common.btn.save') }}</span>
            </v-btn>
            <v-btn
              v-if="!editable && generalSettingModify"
              @click="editable = true"
              round
              outline
              color="primary"
              class="mb-2"
            >
              <span> {{ $t('common.btn.edit') }}</span>
            </v-btn>
          </v-layout>
        </v-card-title>
        <v-container fluid grid-list-lg>
          <v-alert class="mb-3" :value="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>

          <template>
            <base-page-loading v-if="loading" class="mb-3"></base-page-loading>
          </template>

          <v-layout row wrap v-if="loading === false">
            <v-flex xs12>
              <v-layout>
                <v-flex xs12>
                  <h3 class="d-flex align-center mb-2">
                    {{
                      $t('page.systemSetting_general.title_preqResendInterval')
                    }}
                  </h3>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs6>
                  <v-text-field
                    name="preqResendInterval"
                    v-model="preqResendInterval"
                    v-validate="'required|numeric|between:60,1440'"
                    :label="
                      $t('page.systemSetting_general.label_preqResendInterval')
                    "
                    :data-vv-as="
                      $t('page.systemSetting_general.label_preqResendInterval')
                    "
                    :suffix="
                      $tc(
                        'page.systemSetting_general.suffix_minute',
                        preqResendInterval
                      )
                    "
                    :error-messages="errors.first('preqResendInterval')"
                    :disabled="!editable"
                    autocomplete="off"
                    outline
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <h3 class="d-flex align-center mb-2">
                    {{
                      $t('page.systemSetting_general.title_connectionTimeout')
                    }}
                  </h3>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs6>
                  <v-text-field
                    name="areqConnectionTimeout"
                    v-model="areqConnectionTimeout"
                    v-validate="'required|numeric|between:1,30'"
                    :label="
                      $t(
                        'page.systemSetting_general.label_areqConnectionTimeout'
                      )
                    "
                    :data-vv-as="
                      $t(
                        'page.systemSetting_general.label_areqConnectionTimeout'
                      )
                    "
                    :suffix="
                      $tc(
                        'page.systemSetting_general.suffix_second',
                        areqConnectionTimeout
                      )
                    "
                    :error-messages="errors.first('areqConnectionTimeout')"
                    :disabled="!editable"
                    outline
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    name="rreqConnectionTimeout"
                    v-model="rreqConnectionTimeout"
                    v-validate="'numeric|required|between:1,30'"
                    :label="
                      $t(
                        'page.systemSetting_general.label_rreqConnectionTimeout'
                      )
                    "
                    :data-vv-as="
                      $t(
                        'page.systemSetting_general.label_rreqConnectionTimeout'
                      )
                    "
                    :suffix="
                      $tc(
                        'page.systemSetting_general.suffix_second',
                        rreqConnectionTimeout
                      )
                    "
                    :error-messages="errors.first('rreqConnectionTimeout')"
                    :disabled="!editable"
                    outline
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <h3 class="d-flex align-center mb-2">
                    {{ $t('page.systemSetting_general.title_readTimeout') }}
                  </h3>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs6>
                  <v-text-field
                    name="areqReadTimeout"
                    v-model="areqReadTimeout"
                    v-validate="'numeric|required|between:1,30'"
                    :label="
                      $t('page.systemSetting_general.label_areqReadTimeout')
                    "
                    :data-vv-as="
                      $t('page.systemSetting_general.label_areqReadTimeout')
                    "
                    :suffix="
                      $tc(
                        'page.systemSetting_general.suffix_second',
                        areqReadTimeout
                      )
                    "
                    :error-messages="errors.first('areqReadTimeout')"
                    :disabled="!editable"
                    outline
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    name="rreqReadTimeout"
                    v-model="rreqReadTimeout"
                    disabled
                    :label="
                      $t('page.systemSetting_general.label_rreqReadTimeout')
                    "
                    :suffix="
                      $tc(
                        'page.systemSetting_general.suffix_second',
                        rreqReadTimeout
                      )
                    "
                    outline
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import { alertSendComplete } from '@/mixins/alertTextCollection';
import {
  apiGetGeneralSettings,
  apiSaveGeneralSettings
} from '@/api/apiClient/systemSetting_generalSetting';

export default {
  mixins: [alertSendComplete],

  data() {
    return {
      preqResendInterval: 60,
      areqConnectionTimeout: 30,
      rreqConnectionTimeout: 30,
      areqReadTimeout: 60,
      rreqReadTimeout: 3, // EMV req 224, do not change
      loading: false,
      sending: false,
      editable: false,
      errorMessage: null
    };
  },

  computed: {
    generalSettingModify() {
      return getDecryptLocalStorage('permission').generalSettingModify;
    }
  },

  mounted() {
    this.getGeneralSettings();
  },

  methods: {
    async getGeneralSettings() {
      try {
        const response = await apiGetGeneralSettings();
        this.preqResendInterval = response.data.data.preqResendInterval;
        this.areqConnectionTimeout = response.data.data.areqConnectionTimeout;
        this.rreqConnectionTimeout = response.data.data.rreqConnectionTimeout;
        this.areqReadTimeout = response.data.data.areqReadTimeout;
        this.rreqReadTimeout = response.data.data.rreqReadTimeout;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async saveGeneralSettings() {
      if (await this.$validator.validateAll()) {
        this.loading = true;

        try {
          await apiSaveGeneralSettings(
            this.preqResendInterval,
            this.areqConnectionTimeout,
            this.rreqConnectionTimeout,
            this.areqReadTimeout
          );
          this.editable = false;
          this.$swal(this.alertSendComplete);
          await this.getGeneralSettings();
        } catch (error) {
          this.errorMessage = error.message;
        }
        this.loading = false;
      }
    },

    async cancelSavingGeneralSettings() {
      this.editable = false;
      this.errorMessage = null;
      await this.getGeneralSettings();
    }
  }
};
</script>
