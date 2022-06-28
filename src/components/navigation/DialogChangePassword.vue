<template>
  <base-dialog-form
    @close-dialog="closeDialog"
    @submit-form="submitForm"
    :max-width="700"
    :value="dialogChangePasswordState"
    :disableCancelButton="getNeedUpdatePassword"
    :sending="sending"
  >
    <template slot="dialogTitle">
      {{ $t('toolbar.personalSetting.dialog_passwordChange.title') }}
    </template>
    <template slot="dialogContent">
      <v-layout row wrap>
        <v-flex xs12>
          <v-alert :value="getNeedUpdatePassword" type="warning">
            {{ $t('toolbar.personalSetting.dialog_passwordChange.warning') }}
          </v-alert>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            v-model.trim="currentPassword"
            type="password"
            :label="
              $t(
                'toolbar.personalSetting.dialog_passwordChange.label_currentPassword'
              )
            "
            :data-vv-as="
              $t(
                'toolbar.personalSetting.dialog_passwordChange.label_currentPassword'
              )
            "
            name="old_password"
            v-validate="'required'"
            :error-messages="errors.first('old_password')"
            :hide-details="!errors.collect('old_password').length"
            autocomplete="off"
            class="mb-3"
            outline
          >
          </v-text-field>
          <v-text-field
            v-model.trim="newPassword"
            type="password"
            :label="
              $t(
                'toolbar.personalSetting.dialog_passwordChange.label_newPassword'
              )
            "
            :data-vv-as="
              $t(
                'toolbar.personalSetting.dialog_passwordChange.label_newPassword'
              )
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
              $t(
                'toolbar.personalSetting.dialog_passwordChange.label_retypeNewPassword'
              )
            "
            :data-vv-as="
              $t(
                'toolbar.personalSetting.dialog_passwordChange.label_retypeNewPassword'
              )
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

      <v-alert :value="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>

      <v-layout row wrap v-if="passwordPrinciple">
        <v-flex xs12 mb-2>
          <v-divider></v-divider>
        </v-flex>

        <v-flex xs12>
          <base-operation-prompt>
            {{
              $t('toolbar.personalSetting.dialog_passwordChange.prompt_title')
            }}
            {{
              $tc(
                'toolbar.personalSetting.dialog_passwordChange.prompt_minDuplicate',
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
                  $t(
                    'toolbar.personalSetting.dialog_passwordChange.note_characters',
                    {
                      min: passwordPrinciple.mimaMinLength,
                      max: passwordPrinciple.mimaMaxLength
                    }
                  )
                }}
              </li>
              <li>
                {{
                  $t(
                    'toolbar.personalSetting.dialog_passwordChange.note_englishCharacters',
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
                  $t(
                    'toolbar.personalSetting.dialog_passwordChange.note_numeric',
                    {
                      min: passwordPrinciple.mimaMinNumeric
                    }
                  )
                }}
              </li>
              <li v-show="passwordPrinciple.mimaMinSpecialChar > 0">
                {{
                  $t(
                    'toolbar.personalSetting.dialog_passwordChange.note_specialChar',
                    {
                      min: passwordPrinciple.mimaMinSpecialChar
                    }
                  )
                }}
              </li>
            </ul>
          </div>
        </v-flex>

        <v-flex xs12 mt-2>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
    </template>
  </base-dialog-form>
</template>

<script>
import router from '@/router/router';
import {
  getDecryptLocalStorage,
  getDecryptLocalStorageStringData
} from '@/utils/processLocalStorage';
import { alertPasswordChanged } from '@/mixins/alertTextCollection';
import { mapGetters } from 'vuex';
import {
  apiChangePassword,
  apiGetPasswordPrincipleDesc
} from '@/api/apiClient/personalSetting';

export default {
  mixins: [alertPasswordChanged],
  props: {
    dialogChangePasswordState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errorMessage: null,
      currentPassword: '',
      newPassword: '',
      retypeNewPassword: '',
      passwordPrinciple: null,
      sending: false
    };
  },
  computed: {
    ...mapGetters(['getNeedUpdatePassword']),

    getStoreIssuerBankId() {
      return getDecryptLocalStorage('issuerBankId');
    },

    getStoreAccount() {
      return getDecryptLocalStorageStringData('account');
    }
  },
  watch: {
    dialogChangePasswordState(val) {
      if (val) {
        this.resetDialog();
      }
    }
  },
  created() {
    this.errorMessage = null;
    this.getPasswordPrincipleDesc();
  },
  methods: {
    async getPasswordPrincipleDesc() {
      try {
        let response = await apiGetPasswordPrincipleDesc(
          this.getStoreIssuerBankId
        );
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
          await apiChangePassword(
            this.getStoreIssuerBankId,
            this.getStoreAccount,
            this.currentPassword,
            this.newPassword,
            this.retypeNewPassword
          );
          this.$swal(this.alertPasswordChanged).then(() => {
            this.resetDialog();
            this.closeDialog();
            localStorage.removeItem('x-csrf-token');
            router.go(0);
          });
        } catch (error) {
          this.errorMessage = error.message;
        } finally {
          this.sending = false;
        }
      }
    },
    closeDialog() {
      this.$emit('update:dialogChangePasswordState', false);
    },

    resetDialog() {
      this.currentPassword = '';
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
