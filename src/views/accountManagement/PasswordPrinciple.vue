<template>
  <v-layout wrap>
    <base-page-title>
      <template slot="pageTitle">
        {{ $t('menu.account.sub.passwordPrinciple') }}
      </template>
      <template slot="pageDescription">
        {{ $t('page.account_passwordPrinciple.description') }}
      </template>
    </base-page-title>

    <v-flex xs12>
      <v-alert class="mb-3" :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-flex>

    <template v-if="mimaRule">
      <v-flex xs12 class="text-xs-center mt-3" v-if="loading">
        <base-page-loading class="mb-3"></base-page-loading>
      </v-flex>

      <v-flex xs12 v-if="showSettingArea && loading === false">
        <v-card>
          <v-container fluid grid-list-lg>
            <v-layout wrap>
              <v-flex xs12>
                <h3 class="d-flex align-center mb-2">
                  {{
                    $t('page.account_passwordPrinciple.setting.title_setting')
                  }}
                </h3>
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  v-model="pageData.loginRetryCount"
                  :label="
                    $t(
                      'page.account_passwordPrinciple.setting.label_loginRetryCount'
                    )
                  "
                  :data-vv-as="
                    $t(
                      'page.account_passwordPrinciple.setting.label_loginRetryCount'
                    )
                  "
                  :suffix="
                    $tc(
                      'page.account_passwordPrinciple.setting.suffix_loginRetryCount',
                      pageData.loginRetryCount
                    )
                  "
                  name="loginRetryCount"
                  v-validate="
                    `required|numeric|between:${mimaRule.min_retry_count},${mimaRule.max_retry_count}`
                  "
                  :error-messages="errors.first('loginRetryCount')"
                  maxlength="2"
                  outline
                  autocomplete="off"
                  :disabled="!getStoreMimaPolicyModify"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="pageData.mimaFreshInterval"
                  :label="
                    $t(
                      'page.account_passwordPrinciple.setting.label_updateFrequency'
                    )
                  "
                  :data-vv-as="
                    $t(
                      'page.account_passwordPrinciple.setting.label_updateFrequency'
                    )
                  "
                  :suffix="
                    $tc(
                      'page.account_passwordPrinciple.setting.suffix_updateFrequency',
                      pageData.mimaFreshInterval
                    )
                  "
                  name="mimaFreshInterval"
                  v-validate="
                    `required|numeric|between:${mimaRule.min_fresh_interval},${mimaRule.max_fresh_interval}`
                  "
                  :error-messages="errors.first('mimaFreshInterval')"
                  maxlength="2"
                  outline
                  autocomplete="off"
                  :disabled="!getStoreMimaPolicyModify"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="pageData.accountMaxIdleDay"
                  :label="
                    $t(
                      'page.account_passwordPrinciple.setting.label_maxUnusedPeriod'
                    )
                  "
                  :data-vv-as="
                    $t(
                      'page.account_passwordPrinciple.setting.label_maxUnusedPeriod'
                    )
                  "
                  :suffix="
                    $tc(
                      'page.account_passwordPrinciple.setting.suffix_maxUnusedPeriod',
                      pageData.accountMaxIdleDay
                    )
                  "
                  name="accountMaxIdleDay"
                  v-validate="
                    `required|numeric|between:${mimaRule.min_account_idle_day},${mimaRule.max_account_idle_day}`
                  "
                  :error-messages="errors.first('accountMaxIdleDay')"
                  maxlength="2"
                  outline
                  autocomplete="off"
                  :disabled="!getStoreMimaPolicyModify"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="pageData.mimaHistoryDupCount"
                  :label="
                    $t(
                      'page.account_passwordPrinciple.setting.label_minDuplicate'
                    )
                  "
                  :data-vv-as="
                    $t(
                      'page.account_passwordPrinciple.setting.label_minDuplicate'
                    )
                  "
                  :suffix="
                    $tc(
                      'page.account_passwordPrinciple.setting.suffix_minDuplicate',
                      pageData.mimaHistoryDupCount
                    )
                  "
                  name="mimaHistoryDupCount"
                  v-validate="
                    `required|numeric|min_value:${mimaRule.history_duplicate_count}`
                  "
                  :error-messages="errors.first('mimaHistoryDupCount')"
                  maxlength="2"
                  outline
                  autocomplete="off"
                  :disabled="!getStoreMimaPolicyModify"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 mb-2>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12>
                <h3 class="mb-2">
                  {{
                    $t(
                      'page.account_passwordPrinciple.setting.title_characterRules'
                    )
                  }}
                </h3>
                <base-operation-prompt>
                  {{ $t('page.account_passwordPrinciple.setting.prompt') }}
                </base-operation-prompt>
              </v-flex>

              <!-- 密碼字元數限制 輸入框 -->
              <v-flex xs6>
                <v-text-field
                  v-model="pageData.mimaMinLength"
                  :label="
                    $t(
                      'page.account_passwordPrinciple.setting.label_minCharacters'
                    )
                  "
                  :data-vv-as="
                    $t(
                      'page.account_passwordPrinciple.setting.label_minCharacters'
                    )
                  "
                  name="mimaMinLength"
                  v-validate="
                    `required|numeric|min_value:${mimaRule.min_length}`
                  "
                  :error-messages="errors.first('mimaMinLength')"
                  maxlength="1"
                  outline
                  autocomplete="off"
                  :disabled="!getStoreMimaPolicyModify"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="pageData.mimaMaxLength"
                  :label="
                    $t(
                      'page.account_passwordPrinciple.setting.label_maxCharacters'
                    )
                  "
                  :data-vv-as="
                    $t(
                      'page.account_passwordPrinciple.setting.label_maxCharacters'
                    )
                  "
                  name="mimaMaxLength"
                  v-validate="
                    `required|numeric|between:${mimaRule.min_length},${mimaRule.max_length}`
                  "
                  :error-messages="errors.first('mimaMaxLength')"
                  maxlength="2"
                  outline
                  autocomplete="off"
                  :disabled="!getStoreMimaPolicyModify"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 pa-3 class="password-policy">
                <v-layout wrap row class="grey lighten-4 pa-4">
                  <v-flex xs6>
                    <v-text-field
                      v-model="pageData.mimaAlphabetCount"
                      :label="
                        $t(
                          'page.account_passwordPrinciple.setting.label_minEnglishCharacters'
                        )
                      "
                      :data-vv-as="
                        $t(
                          'page.account_passwordPrinciple.setting.label_minEnglishCharacters'
                        )
                      "
                      v-validate="'numeric'"
                      :error-messages="errors.first('mimaAlphabetCount')"
                      name="mimaAlphabetCount"
                      outline
                      maxlength="1"
                      autocomplete="off"
                      class="white"
                      :disabled="!getStoreMimaPolicyModify"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-layout wrap row>
                      <v-flex xs6>
                        <v-text-field
                          v-model="pageData.mimaMinUpperCase"
                          :label="
                            $t(
                              'page.account_passwordPrinciple.setting.label_minEnglishUppercase'
                            )
                          "
                          :data-vv-as="
                            $t(
                              'page.account_passwordPrinciple.setting.label_minEnglishUppercase'
                            )
                          "
                          v-validate="'numeric'"
                          :error-messages="errors.first('mimaMinUpperCase')"
                          name="mimaMinUpperCase"
                          maxlength="1"
                          outline
                          autocomplete="off"
                          class="white"
                          :disabled="!getStoreMimaPolicyModify"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          v-model="pageData.mimaMinLowerCase"
                          :label="
                            $t(
                              'page.account_passwordPrinciple.setting.label_minEnglishLowercase'
                            )
                          "
                          :data-vv-as="
                            $t(
                              'page.account_passwordPrinciple.setting.label_minEnglishLowercase'
                            )
                          "
                          v-validate="'numeric'"
                          :error-messages="errors.first('mimaMinLowerCase')"
                          name="mimaMinLowerCase"
                          maxlength="1"
                          outline
                          autocomplete="off"
                          class="white"
                          :disabled="!getStoreMimaPolicyModify"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="pageData.mimaMinNumeric"
                      :label="
                        $t(
                          'page.account_passwordPrinciple.setting.label_minNumeric'
                        )
                      "
                      :data-vv-as="
                        $t(
                          'page.account_passwordPrinciple.setting.label_minNumeric'
                        )
                      "
                      v-validate="'numeric'"
                      :error-messages="errors.first('mimaMinNumeric')"
                      name="mimaMinNumeric"
                      maxlength="1"
                      outline
                      autocomplete="off"
                      class="white"
                      :disabled="!getStoreMimaPolicyModify"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="pageData.mimaMinSpecialChar"
                      :label="
                        $t(
                          'page.account_passwordPrinciple.setting.label_minSpecialChar'
                        )
                      "
                      :data-vv-as="
                        $t(
                          'page.account_passwordPrinciple.setting.label_minSpecialChar'
                        )
                      "
                      v-validate="'numeric'"
                      :error-messages="errors.first('mimaMinSpecialChar')"
                      name="mimaMinSpecialChar"
                      maxlength="1"
                      outline
                      autocomplete="off"
                      class="white"
                      :disabled="!getStoreMimaPolicyModify"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>

              <!-- 送出按鈕 -->
              <v-flex xs12 mb-2>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 mb-2>
                <div class="text-xs-center">
                  <v-btn
                    round
                    color="primary"
                    :disabled="!getStoreMimaPolicyModify"
                    :loading="loading"
                    @click="updatePasswordPrinciple()"
                    >{{ $t('common.btn.save') }}</v-btn
                  >
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';
import { alertSendComplete } from '@/mixins/alertTextCollection';
import {
  apiGetFieldCheckConditions,
  apiGetPasswordPrinciple,
  apiUpdatePasswordPrinciple
} from '@/api/apiClient/accountManagement';

export default {
  mixins: [alertSendComplete],

  data() {
    return {
      issuerBankId: null,

      pageData: {
        loginRetryCount: null,
        mimaFreshInterval: null,
        accountMaxIdleDay: null,
        mimaHistoryDupCount: null,

        mimaMinLength: null,
        mimaMaxLength: null,

        mimaAlphabetCount: null,
        mimaMinUpperCase: null,
        mimaMinLowerCase: null,
        mimaMinNumeric: null,
        mimaMinSpecialChar: null
      },
      mimaRule: null,

      loading: false,
      showSettingArea: false,
      errorMessage: null
    };
  },

  computed: {
    getStoreMimaPolicyModify() {
      return getDecryptLocalStorage('permission').mimaPolicyModify;
    },
    isAddUpThanMimaMax() {
      const addUp = [],
        mima = [
          'mimaAlphabetCount',
          'mimaMinUpperCase',
          'mimaMinLowerCase',
          'mimaMinNumeric',
          'mimaMinSpecialChar'
        ];
      mima.forEach(item => {
        let itemNum = isNaN(this.pageData[item] * 1)
          ? 0
          : this.pageData[item] * 1;
        addUp.push(itemNum);
      });
      return addUp.reduce((a, b) => a + b, 0) > this.pageData.mimaMaxLength;
    }
  },

  watch: {
    issuerBankId(val) {
      this.getPasswordPrinciple();
      this.$store.commit('setStorageCriteria', {
        issuerBankId: val
      });
    }
  },

  created() {
    this.getFieldCheckConditions();
    this.setInitialIssuerBankId();
  },

  methods: {
    async getFieldCheckConditions() {
      this.errorMessage = null;
      try {
        let response = await apiGetFieldCheckConditions();
        this.mimaRule = response.data.data;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    setInitialIssuerBankId() {
      // 重新整理可以重新存取選取得值
      let storageCriteria = this.$store.state.storageCriteria;
      if (storageCriteria.issuerBankId) {
        this.issuerBankId = storageCriteria.issuerBankId;
        return;
      }

      // 取得登入時儲存的 issuerBankId
      this.issuerBankId = getDecryptLocalStorage('issuerBankId');
    },

    async getPasswordPrinciple() {
      this.errorMessage = null;
      try {
        this.loading = true;
        let response = await apiGetPasswordPrinciple(this.issuerBankId);
        this.pageData = response.data.data;
        this.showSettingArea = true;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updatePasswordPrinciple() {
      if (await this.$validator.validateAll()) {
        if (this.isAddUpThanMimaMax) {
          this.errorMessage = this.$t(
            'page.account_passwordPrinciple.setting.warning_characterQty',
            { count: this.pageData.mimaMaxLength }
          );
          return;
        }

        this.loading = true;
        let criteria = {
          id: this.pageData.id,
          loginRetryCount: this.pageData.loginRetryCount,
          mimaFreshInterval: this.pageData.mimaFreshInterval,
          accountMaxIdleDay: this.pageData.accountMaxIdleDay,
          mimaHistoryDupCount: this.pageData.mimaHistoryDupCount,
          mimaMinLength: this.pageData.mimaMinLength,
          mimaMaxLength: this.pageData.mimaMaxLength,
          mimaAlphabetCount: this.pageData.mimaAlphabetCount,
          mimaMinUpperCase: this.pageData.mimaMinUpperCase,
          mimaMinLowerCase: this.pageData.mimaMinLowerCase,
          mimaMinNumeric: this.pageData.mimaMinNumeric,
          mimaMinSpecialChar: this.pageData.mimaMinSpecialChar
        };

        try {
          await apiUpdatePasswordPrinciple(this.issuerBankId, criteria);
          this.$swal(this.alertSendComplete);
          this.getPasswordPrinciple();
        } catch (error) {
          this.errorMessage = error.message;
        }
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.password-policy ::v-deep .v-input__control {
  background-color: #f5f5f5 !important;
  .v-input__slot {
    background-color: #fff !important;
  }
}
</style>
