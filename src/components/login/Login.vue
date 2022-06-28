<template>
  <v-content>
    <dialog-mfa
      :dialog-mfa-state.sync="dialogMfaState"
      :issuer-bank-id="issuerBankId"
      :account="account"
      @submit-form="submitMfaForm"
    ></dialog-mfa>
    <dialog-forget-password
      :dialog-forget-password-state.sync="dialogForgetPasswordState"
      :is-multiple-bank="isMultipleBank"
    ></dialog-forget-password>
    <dialog-setting-password
      :dialog-setting-password-state.sync="dialogSettingPasswordState"
      :token="settingPasswordToken"
      :issuerBankId="settingIssuerBankId"
    ></dialog-setting-password>
    <slot name="plugin"></slot>
    <v-container fluid fill-height white class="pa-0">
      <v-layout align-center justify-center>
        <v-flex xs7 class="align-center fill-height">
          <Login-kv></Login-kv>
        </v-flex>

        <v-flex xs5 class="d-flex align-center login-area fill-height">
          <div class="loginForm-width">
            <div class=" text-sm-center ">
              <span class="login-title  font-weight500 pb-1">
                {{ $t('page.login.title') }}
              </span>
            </div>
            <div
              class="font-18 text-sm-center grey--text text--darken-2  font-weight500 my-4"
            >
              {{ $t('page.login.subtitle') }}
            </div>

            <slot name="loginForm">
              <v-form @keyup.native.enter="login" class="mt-2">
                <v-text-field
                  v-model.trim="account"
                  :label="$t('page.login.form.label_userAccount')"
                  @input="errorMessage = null"
                  :browser-autocomplete="'off'"
                  name="login_useraccount"
                  v-validate="'required'"
                  :error-messages="errors.first('login_useraccount')"
                  :hide-details="!errors.collect('login_useraccount').length"
                  class="mb-3"
                  outline
                ></v-text-field>

                <v-text-field
                  v-model.trim="password"
                  type="password"
                  :label="$t('page.login.form.label_password')"
                  @input="errorMessage = null"
                  :browser-autocomplete="'off'"
                  name="login_password"
                  v-validate="'required'"
                  :error-messages="errors.first('login_password')"
                  :hide-details="!errors.collect('login_password').length"
                  class="mb-3"
                  outline
                ></v-text-field>

                <vue-recaptcha
                  v-if="sitekey"
                  ref="recaptcha"
                  :sitekey="sitekey"
                  @verify="onVerified"
                  @expired="onExpired"
                >
                </vue-recaptcha>
              </v-form>
            </slot>

            <slot name="warning"></slot>

            <v-alert class="mt-3" :value="errorMessage" type="error">
              {{ errorMessage }}
            </v-alert>

            <div class="text-sm-center mt-3 mb-2">
              <slot name="loginBtnGroup">
                <v-btn
                  class="white--text loginBtnGroup"
                  @click="login"
                  :loading="loading"
                  block
                  >{{ $t('page.login.form.btn_login') }}</v-btn
                >
                <v-spacer></v-spacer>
              </slot>
            </div>

            <div class="text-sm-center py-0">
              <v-btn
                flat
                class="ma-0 pa-0"
                @click="dialogForgetPasswordState = true"
                style="text-transform: none"
              >
                <span class="ml-1 grey--text text--darken-1">
                  {{ $t('page.login.form.btn_forgetPassword') }}</span
                >
              </v-btn>
            </div>

            <v-divider v-if="this.$config.USE_I18N" class="mt-2"></v-divider>

            <lang-selector
              v-if="this.$config.USE_I18N"
              class="text-sm-center mt-3 grey--text text--darken-1"
            ></lang-selector>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { setEncryptLocalStorage } from '@/utils/processLocalStorage';
import { clearTimer } from '@/utils/inactivity.js';
import { easterEgg } from '@/utils/easterEgg.js';

import LoginKv from '@/components/login/LoginKv.vue';
import LangSelector from '@/components/login/LangSelector.vue';
import DialogMfa from '@/components/login/DialogMfa.vue';
import DialogForgetPassword from '@/components/login/DialogForgetPassword.vue';
import DialogSettingPassword from '@/components/login/DialogSettingPassword.vue';
import { alertServerError } from '@/mixins/alertTextCollection';
import { apiUiConfig } from '@/api/apiClient/config';
import { apiLogin } from '@/api/apiClient/login';
import { apiGetAccountPermission } from '@/api/apiClient/permission';
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  name: 'Login',

  mixins: [alertServerError],

  components: {
    LoginKv,
    LangSelector,
    DialogMfa,
    DialogForgetPassword,
    DialogSettingPassword,
    VueRecaptcha
  },

  props: {
    errorMsg: String
  },

  data() {
    return {
      langs: this.$config.LANGS,
      cherriLogoPath: require('@/assets/cherri_grey.svg'),

      account: '',
      password: '',
      isMultipleBank: false,
      isLdapMode: false,
      isMfa: false,
      loginResponseData: null,

      dialogMfaState: false,
      dialogForgetPasswordState: false,
      dialogSettingPasswordState: false,
      settingIssuerBankId: null,
      settingPasswordToken: null,
      errorMessage: null,
      loading: false,
      sitekey: '',
      recaptchaToken: null
    };
  },

  computed: {
    issuerBankId() {
      return this.loginResponseData ? this.loginResponseData.issuerBankId : 0;
    }
  },

  watch: {
    errorMsg(val) {
      if (val) {
        this.errorMessage = val;
      }
    }
  },

  async created() {
    // Note:vuex-persistedstate無法在此移除localStorage中的vuex
    const clearContent = [
      'x-csrf-token',
      'account',
      'permission',
      'issuerBankId',
      'uiConfig'
    ];
    clearContent.forEach(item => {
      window.localStorage.removeItem(item);
    });

    // 切頁前的sweet alert都不要出現
    this.$swal.close();

    this.getDefaultLang();
    await this.getUiConfig();

    // clear timeout
    clearTimer();

    if (this.$route.path.includes('settingPassword')) {
      this.settingIssuerBankId = Number(this.$route.params.issuerBankId);
      this.settingPasswordToken = this.$route.params.token;
      this.dialogSettingPasswordState = true;
    }
  },

  methods: {
    ...mapMutations({
      changeLang: 'i18nStore/changeLang',
      changeMfaPass: 'changeMfaPass',
      changeNeedUpdatePassword: 'changeNeedUpdatePassword'
    }),

    ...mapActions({
      setPagePermissions: 'pagePermissionStore/setPagePermissions'
    }),

    onVerified(recaptchaToken) {
      this.recaptchaToken = recaptchaToken;
    },

    onExpired() {
      this.recaptchaToken = null;
    },

    getDefaultLang() {
      let defaultlang = this.$config.DEFAULT_LANG;
      if (this.$config.USE_I18N) {
        let browserLang = navigator.language || navigator.browserLanguage;
        // 避免不同瀏覽器的大小寫格式不同
        let lang = this.langs.find(item =>
          item.value
            .toLocaleLowerCase()
            .startsWith(browserLang.toLocaleLowerCase())
        );
        defaultlang = lang ? lang.value : defaultlang;
      }

      let langCode = localStorage.getItem('lang');
      this.changeLang(langCode ? langCode : defaultlang);
    },

    async getUiConfig() {
      try {
        let response = await apiUiConfig();
        setEncryptLocalStorage('uiConfig', JSON.stringify(response.data));
        this.isMultipleBank = response.data.isMultipleBank;
        this.isLdapMode = response.data.isLdapMode;
        this.isMfa = response.data.isMfa;
        this.sitekey = response.data.recaptchaSiteKey;
      } catch (error) {
        this.$swal(this.alertServerError);
      }
    },

    async login(e) {
      e.preventDefault();
      if (await this.$validator.validateAll()) {
        this.errorMessage = null;
        this.loading = true;
        try {
          let criteria = {
            account: this.account,
            password: this.password,
            bankCode: '',
            recaptchaToken: this.recaptchaToken
          };

          let response = await apiLogin(criteria);
          this.loginResponseData = response.data.data;

          localStorage.setItem(
            'x-csrf-token',
            this.loginResponseData ? this.loginResponseData.csrf_token : null
          );

          this.changeNeedUpdatePassword(
            this.loginResponseData
              ? this.loginResponseData.needUpdatePassword
              : false
          );

          if (this.isMfa) {
            this.dialogMfaState = true;
          } else {
            this.storedUserInfo().then(() => {
              this.callRouter();
            });
          }
        } catch (error) {
          switch (error.errorCode) {
            case 'LOGIN_FAILED_LOCKED':
              this.errorMessage = this.$t('page.login.form.error_locked');
              break;
            case 'LOGIN_FAILED_BAD_CREDENTIAL':
              this.errorMessage = this.$t('page.login.form.error_loginFailed');
              this.$refs.recaptcha.reset();
              break;
            case 'LOGIN_FAILED_BAD_RECAPTCHA_TOKEN':
              this.errorMessage = this.$t('page.login.form.error_recaptchaTokenInvalid');
              break;
            case 'USER_GROUP_NOT_FOUND':
              this.errorMessage = this.$t('page.login.form.error_noOwnGroup');
              break;
            default:
              this.errorMessage = error.message;
          }
        }
        this.loading = false;
      }
      easterEgg();
    },

    submitMfaForm() {
      this.storedUserInfo().then(() => {
        this.callRouter();
      });
    },

    /** 記錄使用者資訊
     */
    async storedUserInfo() {
      setEncryptLocalStorage('account', this.loginResponseData.account);

      setEncryptLocalStorage(
        'issuerBankId',
        this.loginResponseData.issuerBankId
      );

      await this.getAccountPermission();
    },

    async callRouter() {
      this.changeMfaPass(true);
      // reload page 以解決browser cache問題
      window.location.href = './';
    },

    async getAccountPermission() {
      try {
        const response = await apiGetAccountPermission();

        setEncryptLocalStorage(
          'permission',
          JSON.stringify(response.data.data)
        );

        // filter out routes that require authentication
        const routes = this.$router.options.routes.filter(
          route => route.children
        )[0].children;

        this.setPagePermissions({
          routes: routes,
          permissions: response.data.data
        });
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-title {
  font-size: 32px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 6px;
    background: $Login-Title-Bg-Color;
  }
}

/deep/ .loginBtnGroup {
  background-color: $Login-Btn-Color !important;
}

.loginForm-width {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 40px;
  padding: 0 10px;
}

.login-area {
  position: relative;
  padding-bottom: 70px;
}

.hintUnAuth {
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
}
</style>
