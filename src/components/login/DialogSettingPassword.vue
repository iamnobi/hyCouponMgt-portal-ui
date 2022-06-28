<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="500"
    :value="dialogSettingPasswordState"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('page.login.dialog_passwordSetting.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-model.trim="newPassword"
            type="password"
            :label="$t('page.login.dialog_passwordSetting.label_newPassword')"
            :data-vv-as="
              $t('page.login.dialog_passwordSetting.label_newPassword')
            "
            name="newPassword"
            v-validate="'required'"
            :error-messages="errors.first('newPassword')"
            :hide-details="!errors.collect('newPassword').length"
            ref="newPassword"
            autocomplete="off"
            class="mb-3"
            outline
          ></v-text-field>
          <v-text-field
            v-model.trim="retypeNewPassword"
            type="password"
            :label="
              $t('page.login.dialog_passwordSetting.label_retypeNewPassword')
            "
            :data-vv-as="
              $t('page.login.dialog_passwordSetting.label_retypeNewPassword')
            "
            name="retypeNewPassword"
            v-validate="'required|confirmed:newPassword'"
            :error-messages="errors.first('retypeNewPassword')"
            :hide-details="!errors.collect('retypeNewPassword').length"
            autocomplete="off"
            class="mb-3"
            outline
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-alert :value="errorMessage" type="error"> {{ errorMessage }} </v-alert>

      <v-layout row wrap v-if="passwordPrinciple">
        <v-flex xs12 mb-2> <v-divider></v-divider> </v-flex>

        <v-flex xs12>
          <base-operation-prompt>
            {{ $t('page.login.dialog_passwordSetting.prompt_title') }}
            {{
              $tc(
                'page.login.dialog_passwordSetting.prompt_minDuplicate',
                passwordPrinciple.mimaHistoryDupCount,
                {
                  min: passwordPrinciple.mimaHistoryDupCount
                }
              )
            }}
          </base-operation-prompt>
          <div class="pl-1 pt-2">
            <ul>
              <li>
                {{
                  $t('page.login.dialog_passwordSetting.note_characters', {
                    min: passwordPrinciple.mimaMinLength,
                    max: passwordPrinciple.mimaMaxLength
                  })
                }}
              </li>
              <li>
                {{
                  $t(
                    'page.login.dialog_passwordSetting.note_englishCharacters',
                    {
                      min: passwordPrinciple.mimaAlphabetCount,
                      uppercase: passwordPrinciple.mimaMinUpperCase,
                      lowercase: passwordPrinciple.mimaMinLowerCase
                    }
                  )
                }}
              </li>
              <li v-show="passwordPrinciple.mimaMinNumeric > 0">
                {{
                  $t('page.login.dialog_passwordSetting.note_numeric', {
                    min: passwordPrinciple.mimaMinNumeric
                  })
                }}
              </li>
              <li v-show="passwordPrinciple.mimaMinSpecialChar > 0">
                {{
                  $t('page.login.dialog_passwordSetting.note_specialChar', {
                    min: passwordPrinciple.mimaMinSpecialChar
                  })
                }}
              </li>
            </ul>
          </div>
        </v-flex>

        <v-flex xs12 mt-2> <v-divider></v-divider> </v-flex>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import router from '@/router/router';
import alertUtil from '@/utils/alertUtil.js';
import { getDecryptLocalStorageStringData } from '@/utils/processLocalStorage';
import {
  apiChangePasswordFromLink,
  apiGetPasswordPrincipleDesc
} from '@/api/apiClient/personalSetting';

export default {
  props: {
    dialogSettingPasswordState: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      default: null
    },
    issuerBankId: {
      type: Number
    }
  },
  data() {
    return {
      errorMessage: null,
      newPassword: '',
      retypeNewPassword: '',
      passwordPrinciple: null,
      sending: false
    };
  },
  computed: {
    getStoreAccount() {
      return getDecryptLocalStorageStringData('account');
    }
  },
  watch: {
    dialogSettingPasswordState(val) {
      if (val) {
        this.getPasswordPolicy();
        this.resetDialog();
      }
    }
  },
  created() {
    this.errorMessage = null;
  },
  methods: {
    async getPasswordPolicy() {
      try {
        let response = await apiGetPasswordPrincipleDesc(this.issuerBankId);
        this.passwordPrinciple = response.data.data;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async submitForm() {
      if (await this.$validator.validateAll()) {
        this.sending = true;
        try {
          await apiChangePasswordFromLink(this.token, this.newPassword);
          alertUtil.sendCompleteAlert();
          this.$validator.reset();
          this.errorMessage = null;
          this.closeDialog();
        } catch (error) {
          this.errorMessage = error.message;
        } finally {
          this.sending = false;
        }
      }
    },
    closeDialog() {
      this.$emit('update:dialogSettingPasswordState', false);
      router.push('/');
    },

    resetDialog() {
      this.newPassword = '';
      this.retypeNewPassword = '';
      this.$validator.reset();
      this.errorMessage = null;
    }
  }
};
</script>

<style lang="scss" scoped>
li {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
